import { on } from "events";

export function Input({ name, label, value, setValue, type = 'text' }: { name: string; label: string; value?: string, setValue?: any, type?: string }) {
  return (
    <>
      <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={e => setValue(e.target.value)}
          autoComplete={name}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </>
  )
}

export function HelpText({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 text-sm leading-6 text-gray-600">{children}</p>
  )
}

export function Textarea({ name, label, rows = 3, value, setValue }: { name: string; label: string, rows?: number, value?: string, setValue?: any }) {
  return (
    <>
      <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <textarea
          id={name}
          name={name}
          rows={rows}
          value={value}
          onChange={e => setValue(e.target.value)}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </>
  )
}

export function Dropdown({ name, label, options, value, setValue }: { name: string; label: string; options: Map<string, string>; value?: string; setValue?: any }) {
  return (
    <>
      <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <select
          id={name}
          name={name}
          autoComplete={name}
          value={value}
          onChange={e => setValue(e.target.value)}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
        >
          {Array.from(options).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
          ))}
        </select>
      </div>
    </>
  )
}

export function Checkbox({ name, label, value, setValue, children }: { name: string; label: string; value?: boolean; setValue?: any; children?: React.ReactNode }) {
  return (
    <div className="relative flex gap-x-3">
      <div className="flex h-6 items-center">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={value}
          onChange={e => setValue(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
        />
      </div>
      <div className="text-sm leading-6">
        <label htmlFor={name} className="font-medium text-gray-900">
          {label}
        </label>
        {children}
      </div>
    </div>
  )
}