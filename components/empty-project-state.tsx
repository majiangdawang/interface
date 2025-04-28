"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Upload, MessageSquare } from "lucide-react"
import { DragDropArea } from "@/components/drag-drop-area"

interface EmptyProjectStateProps {
  onStartCreatingDocument: (description: string) => void
  onFilesUploaded: () => void
}

export function EmptyProjectState({ onStartCreatingDocument, onFilesUploaded }: EmptyProjectStateProps) {
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projectDescription, setProjectDescription] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleStartCreating = () => {
    if (projectDescription.trim()) {
      onStartCreatingDocument(projectDescription)
    }
  }

  const handleFilesUploaded = () => {
    onFilesUploaded()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Call the callback with the description
    onStartCreatingDocument(description)

    setIsSubmitting(false)
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-sm p-8 border">
        <div className="text-center mb-8">
          <div className="bg-blue-50 rounded-full p-4 inline-block mb-4">
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">开始创建需求规格说明书</h1>
          <p className="text-gray-500">
            请描述您的项目需求，或上传需求相关文件，我们将帮助您生成专业的需求规格说明书。
          </p>
        </div>

        <div className="mb-6">
          <Textarea
            ref={textareaRef}
            placeholder="请描述您的项目需求和目标..."
            className="min-h-[150px] text-base p-4"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
          />
        </div>

        <div className="mb-8">
          <DragDropArea
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onDrop={() => {
              setIsDragging(false)
              handleFilesUploaded()
            }}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
            }`}
          >
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 mb-1">拖拽文件到此处或点击上传</p>
            <p className="text-xs text-gray-400">支持 PDF、Word、Excel、图片等格式</p>
          </DragDropArea>
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleStartCreating}
            disabled={!projectDescription.trim()}
            className="px-6 py-2 h-auto"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            开始创建需求规格说明书
          </Button>
        </div>
      </div>
    </div>
  )
}
