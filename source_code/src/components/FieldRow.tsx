"use client"

import React from 'react'

type Props = {
  label: string
  value?: React.ReactNode
}

export default function FieldRow({ label, value }: Props) {
  const display = value === null || value === undefined || value === '' ? 'N/A' : value
  return (
    <div className="flex items-start gap-4">
      <dt className="w-28 text-neutral-500 text-sm">{label}</dt>
      <dd className="text-sm text-neutral-800">{display}</dd>
    </div>
  )
}
