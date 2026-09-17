from rest_framework.response import Response 
from django.http import JsonResponse
from .serializers import resumeSerializer, jobDesciptionSerializer, resultSerializer
from rest_framework.views import APIView
from rest_framework import status
from .extract_texts import extract_text_from_file, extract_json
from .gemini_responses import resume_vs_jd
from .models import ResumeMatchResultModel

from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User

from django.http import Http404

# Create your views here.

TEMP_DATA = {
    "resume_text": None,
    "resume_file_name":None,
    'user_id':None,
    'obj_id':None
}

class resumeView(APIView):

    def post(self,request):
        try:
            serializer = resumeSerializer(data = request.data)
            if serializer.is_valid():
                resume_file = serializer.validated_data['resume']
                text = extract_text_from_file(resume_file,resume_file.name)
                TEMP_DATA['resume_text'] = text
                TEMP_DATA['resume_file_name'] = resume_file.name
                
                return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return JsonResponse({'message':str(e)},status=status.HTTP_400_BAD_REQUEST)


class jdView(APIView):
  
    def post(self,request):
        try:
            
            if TEMP_DATA['resume_text'] is None:
                raise Exception({'message': 'Upload resume first'}, status=status.HTTP_400_BAD_REQUEST)
            
            serializer = jobDesciptionSerializer(data=request.data)

            if serializer.is_valid():
                job_title = serializer.validated_data['jobTitle']
                company = serializer.validated_data['company']
                jd_text = serializer.validated_data['jdText']
                
                gemini_response = resume_vs_jd(TEMP_DATA['resume_text'],jd_text)
                result = gemini_response.candidates[0].content.parts[0].text
                try:
                    clean_json = extract_json(result)
                except Exception:
                    raise Exception({'message': 'Gemini did not return valid JSON'}, status=status.HTTP_400_BAD_REQUEST)
        
                job_info = {
                    'job_title':job_title,
                    'company' : company
                }
                
                refresh_token = request.COOKIES.get('refresh_token')   
                token = RefreshToken(refresh_token)
                user_id = token['user_id']
                TEMP_DATA['user_id'] = user_id
                user = User.objects.get(id=user_id)
                
                obj = ResumeMatchResultModel.objects.create(
                    user = user,
                    resume_file_name = TEMP_DATA['resume_file_name'],
                    job_info = job_info,
                    result_json = clean_json,
                )
                TEMP_DATA['obj_id'] = obj.id
                return Response(status = status.HTTP_200_OK)
        except Exception as e:
            return JsonResponse({'message':str(e)},status=status.HTTP_400_BAD_REQUEST)
    

class resultView(APIView):

    def get(self,request):

        if TEMP_DATA['user_id'] is not None and TEMP_DATA['obj_id'] is not None :
            result = ResumeMatchResultModel.objects.filter(user_id=TEMP_DATA['user_id'],id=TEMP_DATA['obj_id'])
            if not result:
                return JsonResponse({"message":"No Data Found"},status = status.HTTP_404_NOT_FOUND)
            else:
                serializer = resultSerializer(result,many=True)       
                is_resume = serializer.data[0]["result_json"]["is_resume"]
        else:
            return JsonResponse({"message":"No Data Found"},status = status.HTTP_404_NOT_FOUND)
        
        try:
            if is_resume == "yes":
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                raise Exception("Your File Is Not Resume Data Containing.")
        except Exception as e:
            return JsonResponse({"message":str(e)},status=status.HTTP_400_BAD_REQUEST)

    
class dashboardView(APIView):
    
    def get(self,request):
        
        try:
            refresh_token = request.COOKIES.get('refresh_token')   
            token = RefreshToken(refresh_token)       
            id = token['user_id']
            user = User.objects.get(id = int(id))
            
            all_result = ResumeMatchResultModel.objects.filter(user__id = id).order_by("-id")[:5]
            serializer = resultSerializer(all_result,many= True)
            response_data = []
            total_analyzed = all_result.count()

            for data in serializer.data:
                id = data["id"]
                resume_file = data["resume_file_name"]
                job_title = data["job_info"]['job_title']
                score = data["result_json"]["overall_match_score"]
                created_at = data["created_at"]
                response_data.append({"id":id,"resume":resume_file,"job_title":job_title,"score":score,"created_at":created_at,
                                       })

            return Response({"result":response_data,"username":user.username,"total_analyzed":total_analyzed},status=status.HTTP_200_OK)
        
        except Exception as e:
            return JsonResponse({"message":str(e)},status=status.HTTP_400_BAD_REQUEST)


class recentHistoryView(APIView):

    def get(self,request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')   
            token = RefreshToken(refresh_token)       
            id = token['user_id']
            
            result = ResumeMatchResultModel.objects.filter(user_id=id).order_by('-id')
            serializer = resultSerializer(result, many=True)
            response_data = []

            if serializer.data:
                for data in serializer.data:
                    id = data['id']
                    resume_file = data["resume_file_name"]
                    job_title = data["job_info"]['job_title']
                    score = data["result_json"]["overall_match_score"]
                    created_at = data["created_at"]
                    response_data.append({"id":id,"resume":resume_file,"job_title":job_title,"score":score,"created_at":created_at,
                                        })

                return Response({'result':response_data}, status = status.HTTP_200_OK)
            else :
                return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return JsonResponse({'message':str(e)},status=status.HTTP_400_BAD_REQUEST)


class ResultView(APIView):

    def get_object(self,pk):
        try:
            return ResumeMatchResultModel.objects.get(id=pk)
        except ResumeMatchResultModel.DoesNotExist:
            raise Http404

    def get(self,request,pk):
        try:
            result = self.get_object(pk)
            if result:
                serializers = resultSerializer(result)
                return Response([serializers.data], status = status.HTTP_200_OK)
        except Exception as e:
            return Response({"message":"No Data Found"},status=status.HTTP_404_NOT_FOUND)

    def delete(self,request,pk):
        try:
            result = self.get_object(pk)
            result.delete()
            return Response(status = status.HTTP_200_OK)
        except:
            return Response(status = status.HTTP_400_BAD_REQUEST)