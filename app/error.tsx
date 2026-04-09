"use client";
export default function Error({ error }: { error: Error }) {
  return <div className="text-red-400 p-8">Error: {error.message}</div>;
}
