import { useMemo } from 'react'
import '../../assets/style/builder/resumeTemplate.css'
import { renderResumeHtml } from './templateEngine'

export default function ResumePreview({ data = {}, template = null }) {
    // Determine html and css from template prop
    const { htmlContent, cssContent } = useMemo(() => {
        if (!template) {
            return { htmlContent: "", cssContent: "" }
        }

        // If template is an object with html_content or html
        if (typeof template === "object") {
            return {
                htmlContent: template.html_content || template.html || "",
                cssContent: template.css_content || template.css || "",
            }
        }

        return { htmlContent: "", cssContent: "" }
    }, [template])

    const renderedHtml = useMemo(() => {
        if (!htmlContent) {
            return `<div class="resume-empty-prompt">
                <h3>Select a template to preview</h3>
                <p>Choose any template from the list to see your resume rendered live.</p>
            </div>`
        }
        return renderResumeHtml(htmlContent, data)
    }, [htmlContent, data])

    return (
        <div className="resume-preview-container">
            {cssContent && <style>{cssContent}</style>}
            <div
                className="resume-a4-page"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
        </div>
    )
}