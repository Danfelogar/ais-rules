import { Search } from 'lucide-react'

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search Pokemon...',
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-base shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />
    </div>
  )
}