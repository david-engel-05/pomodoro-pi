'use client'

import { useState, useEffect } from 'react'
import { ChevronDownIcon, PlusIcon, TagIcon } from '@heroicons/react/24/outline'
import { Category } from '@/types'
import { supabase } from '@/lib/supabase'

interface CategorySelectorProps {
  selectedCategoryId?: string
  onCategorySelect: (categoryId?: string) => void
  onCreateCategory?: (category: Category) => void
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'work', name: 'Work', color: '#e85d5d', icon: '💼', created_at: '', updated_at: '' },
  { id: 'study', name: 'Study', color: '#3b82f6', icon: '📚', created_at: '', updated_at: '' },
  { id: 'coding', name: 'Coding', color: '#10b981', icon: '💻', created_at: '', updated_at: '' },
  { id: 'writing', name: 'Writing', color: '#8b5cf6', icon: '✍️', created_at: '', updated_at: '' },
  { id: 'reading', name: 'Reading', color: '#f59e0b', icon: '📖', created_at: '', updated_at: '' },
  { id: 'exercise', name: 'Exercise', color: '#ef4444', icon: '🏃', created_at: '', updated_at: '' },
]

export default function CategorySelector({
  selectedCategoryId,
  onCategorySelect,
  onCreateCategory
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .or(`user_id.eq.${user.id},user_id.is.null`)
          .order('created_at', { ascending: true })

        if (error) {
          console.error('Error loading categories:', error)
          return
        }

        if (data) {
          setCategories(data)
        }
      } else {
        // For anonymous users, load from local storage
        const stored = localStorage.getItem('pomodoro_categories')
        if (stored) {
          const customCategories = JSON.parse(stored)
          setCategories([...DEFAULT_CATEGORIES, ...customCategories])
        }
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const createCategory = async (name: string, color: string, icon: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const newCategory: Category = {
        id: `custom_${Date.now()}`,
        name,
        color,
        icon,
        user_id: user?.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      if (user) {
        const { data, error } = await supabase
          .from('categories')
          .insert({
            name,
            color,
            icon,
            user_id: user.id
          })
          .select()
          .single()

        if (error) throw error
        
        if (data) {
          setCategories(prev => [...prev, data])
          onCreateCategory?.(data)
          return data
        }
      } else {
        // For anonymous users, save to local storage
        const stored = localStorage.getItem('pomodoro_categories')
        const existingCategories = stored ? JSON.parse(stored) : []
        const updatedCategories = [...existingCategories, newCategory]
        
        localStorage.setItem('pomodoro_categories', JSON.stringify(updatedCategories))
        setCategories(prev => [...prev, newCategory])
        onCreateCategory?.(newCategory)
        return newCategory
      }
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all"
      >
        {selectedCategory ? (
          <>
            <span className="text-lg">{selectedCategory.icon}</span>
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {selectedCategory.name}
            </span>
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: selectedCategory.color }}
            />
          </>
        ) : (
          <>
            <TagIcon className="w-5 h-5 text-slate-500" />
            <span className="text-slate-500 dark:text-slate-400">
              Select Category
            </span>
          </>
        )}
        <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg z-20 max-h-64 overflow-y-auto">
            {/* None option */}
            <button
              onClick={() => {
                onCategorySelect(undefined)
                setIsOpen(false)
              }}
              className="w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center space-x-2"
            >
              <TagIcon className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500 dark:text-slate-400">No Category</span>
            </button>

            {/* Categories */}
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  onCategorySelect(category.id)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center space-x-2 ${
                  selectedCategoryId === category.id ? 'bg-slate-100 dark:bg-slate-700' : ''
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="font-medium text-slate-700 dark:text-slate-200 flex-1">
                  {category.name}
                </span>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
              </button>
            ))}

            {/* Create new category button */}
            <button
              onClick={() => {
                // For now, create a simple dialog - in a real app you'd want a proper modal
                const name = prompt('Category name:')
                const color = prompt('Color (hex):', '#e85d5d')
                const icon = prompt('Icon (emoji):', '📝')
                
                if (name && color && icon) {
                  createCategory(name, color, icon)
                }
                setIsOpen(false)
              }}
              className="w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center space-x-2 border-t border-slate-200 dark:border-slate-700"
            >
              <PlusIcon className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500 dark:text-slate-400">Create New Category</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}