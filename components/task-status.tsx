// components/task-status.tsx
"use client"
import { Check, Play, Circle, ChevronDown, ChevronRight } from "lucide-react"

export type TaskStatus = "completed" | "in-progress" | "pending"

// 更新 Task 接口，确保包含 messageId 和 messageContent
export interface Task {
  id: string
  name: string
  status: TaskStatus
  executionTime?: number
  conversationId: string
  messageId?: string
  messageContent?: string
}

// Group tasks by conversation
interface ConversationTaskGroup {
  conversationId: string
  title: string
  timestamp: Date
  tasks: Task[]
  taskGroupId?: string
}

// 更新 TaskStatusProps 接口
export interface TaskStatusProps {
  taskGroups: ConversationTaskGroup[] | undefined; // 明确 taskGroups 可以是 undefined
  collapsedMode?: boolean
  maxVisibleTasks?: number
  expandedGroups?: Record<string, boolean>
  onToggleGroup?: (groupId: string) => void
}

export function TaskStatus({
  taskGroups, // 接收 taskGroups prop
  collapsedMode = false,
  maxVisibleTasks = 3,
  expandedGroups = {},
  onToggleGroup,
}: TaskStatusProps) {
  // 修改 isGroupExpanded 函数，使用任务组 ID
  const isGroupExpanded = (group: ConversationTaskGroup) => {
    // 使用任务组ID或创建一个唯一ID
    const groupId = group.taskGroupId || group.conversationId
    // 确保 expandedGroups 存在
    return expandedGroups?.[groupId] ?? false
  }

  // --- 添加这个检查来处理 taskGroups 为 undefined 的情况 ---
  if (!taskGroups || !Array.isArray(taskGroups)) {
    // 在服务器端渲染时，如果 taskGroups 是 undefined，会渲染这个
    // 在客户端加载后，如果 taskGroups 被 useState 初始化为数组，会正常渲染列表
    return (
        <div className="border rounded-md bg-gray-50 text-xs divide-y p-2 text-center text-gray-500">
          加载任务组中...
        </div>
    );
  }
  // -------------------------------------------------------------


  return (
    <div className="border rounded-md bg-gray-50 text-xs divide-y">
      {/* 现在可以安全地使用 taskGroups.map()，因为上面已经检查过了 */}
      {taskGroups.map((group) => {
        const completedTasks = group.tasks.filter((task) => task.status === "completed")
        const activeTasks = group.tasks.filter((task) => task.status !== "completed")
        const allCompleted = group.tasks.length > 0 && activeTasks.length === 0

        // 确定要显示的任务
        const expanded = isGroupExpanded(group)
        const tasksToShow =
          expanded || !collapsedMode
            ? group.tasks
            : [...activeTasks, ...completedTasks.slice(0, Math.max(0, maxVisibleTasks - activeTasks.length))]

        const hiddenCompletedCount =
          collapsedMode && !expanded ? completedTasks.length - Math.max(0, maxVisibleTasks - activeTasks.length) : 0

        // 使用任务组ID或创建一个唯一ID
        const groupId = group.taskGroupId || group.conversationId; // 确保 groupId 有值

        return (
          // 确保 group 和 groupId 存在
          group && groupId ? (
          <div key={groupId} className="task-group">
            {/* Conversation header */}
            <div
              className="flex items-center justify-between p-2 bg-gray-100 cursor-pointer hover:bg-gray-200"
              onClick={() => onToggleGroup && onToggleGroup(groupId)}
            >
              <div className="flex items-center gap-1 truncate">
                {expanded ? (
                  <ChevronDown className="h-3 w-3 text-gray-500" />
                ) : (
                  <ChevronRight className="h-3 w-3 text-gray-500" />
                )}
                <span className="font-medium truncate">{group.title}</span>
                {allCompleted && <Check className="h-3 w-3 text-green-500 ml-1" />}
              </div>
              <span className="text-gray-500 text-[10px]">
                {group.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            {/* Tasks */}
            <div className={`${expanded ? "block" : "hidden"}`}>
              {/* 确保 group.tasks 存在且是数组 */}
              {(Array.isArray(group.tasks) ? tasksToShow : []).map((task) => (
                // 确保 task 存在且有 id
                task && task.id ? (
                <div key={task.id} className="flex items-center justify-between p-2 border-t first:border-t-0">
                  <div className="flex items-center gap-2">
                    {task.status === "completed" ? (
                      <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="h-3 w-3 text-green-500" />
                      </div>
                    ) : task.status === "in-progress" ? (
                      <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <Play className="h-3 w-3 text-blue-500" />
                      </div>
                    ) : (
                      <div className="h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center">
                        <Circle className="h-3 w-3 text-gray-300" />
                      </div>
                    )}
                    <span className="text-xs truncate max-w-[120px]">{task.name}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {task.status === "completed" && task.executionTime
                      ? `${task.executionTime.toFixed(1)}秒`
                      : task.status === "in-progress"
                        ? `${task.executionTime?.toFixed(1) || 0.0}秒`
                        : ""}
                  </div>
                </div>
                ) : null // 如果 task 或 task.id 不存在，不渲染
              ))}

              {hiddenCompletedCount > 0 && (
                <div className="p-2 text-center text-xs text-gray-500 border-t">
                  还有 {hiddenCompletedCount} 个已完成任务
                </div>
              )}
            </div>
          </div>
          ) : null // 如果 group 或 groupId 不存在，不渲染该组
        )
      })}

      {/* 这里的 taskGroups.length === 0 判断只有在 taskGroups 是数组时才有效 */}
      {/* 所以需要确保在最开始的检查之后，或者在这里也加上检查 */}
      {/* 直接使用 taskGroups.length === 0 是安全的，因为上面的 if 已经确保了 taskGroups 是数组 */}
       {taskGroups.length === 0 && <div className="p-2 text-center text-xs text-gray-500">暂无任务</div>}
    </div>
  )
}
