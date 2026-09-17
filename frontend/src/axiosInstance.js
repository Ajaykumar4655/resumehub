import axios from 'axios'

const baseURL = import.meta.env.VITE_BACKEND_BASE_URL

const axiosInstance = axios.create({
    baseURL : baseURL,
    headers : {
        'Content-Type':'application/json'
    }
})

// Request Interceptor

axiosInstance.interceptors.request.use(
    function(config){
        const accessToken = localStorage.getItem("access_token")

        if(accessToken){
            config.headers['Authorization'] = `Bearer ${accessToken}`
        }
        return config;
    },
    function(error){
        return Promise.reject(error);
    }
)

// Response interceptor

axiosInstance.interceptors.response.use(
    function(response){
        return response;
    },
    async function(error){
        const originalRequest = error.config

        if(error.response.status === 401 && !originalRequest.retry){
            originalRequest.retry = true

            try{
                const response = await axios.post(`${baseURL}/token/refresh/`,{},{ withCredentials : true})
                localStorage.setItem('access_token', response.data.access)
                originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`

                return axiosInstance(originalRequest)
            }catch(error){
                localStorage.removeItem("access_token")
            }
        }

        return Promise.reject(error)
    }
)

export default axiosInstance