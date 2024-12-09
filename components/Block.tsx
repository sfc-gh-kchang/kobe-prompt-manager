import React from 'react'
import { Block } from '../types'
import { GripVertical, AlignLeft, Code, Type } from 'lucide-react'

interface BlockProps {
  block: Block
  isEditing: boolean
  onUpdate: (updatedBlock: Block) => void
  onReorder: (draggedId: string, targetId: string) => void
}

const BlockComponent: React.FC<BlockProps> = ({ block, isEditing, onUpdate, onReorder }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', block.id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const draggedId = e.dataTransfer.getData('text/plain')
    onReorder(draggedId, block.id)
  }

  const blockStyles = {
    text: 'border-[#29B5E8]',
    example: 'border-[#9B8AFB]',
    input: 'border-[#F0B429]',
  }

  const blockIcons = {
    text: <AlignLeft size={16} className="text-[#29B5E8]" />,
    example: <Code size={16} className="text-[#9B8AFB]" />,
    input: <Type size={16} className="text-[#F0B429]" />,
  }

  return (
    <div
      draggable={isEditing}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`p-4 rounded-md bg-[#40414F] border-l-4 ${blockStyles[block.type]}`}
    >
      <div className="flex items-center mb-2 text-[#8A8F98]">
        {isEditing && <GripVertical size={16} className="cursor-move mr-2" />}
        {blockIcons[block.type]}
        <span className="text-xs uppercase ml-2">{block.type}</span>
      </div>
      <textarea
        className={`w-full p-2 rounded bg-[#2A2B32] text-[#ECECF1] resize-none border border-[#4E4F60]/20 focus:outline-none focus:border-[#29B5E8] ${
          block.type === 'example' ? 'font-mono' : ''
        }`}
        value={block.content}
        onChange={(e) => onUpdate({ ...block, content: e.target.value })}
        readOnly={!isEditing && block.type !== 'input'}
        rows={3}
        placeholder={
          block.type === 'input'
            ? 'Enter your input here...'
            : block.type === 'example'
            ? 'Enter example code here...'
            : 'Enter prompt text here...'
        }
      />
    </div>
  )
}

export default BlockComponent

