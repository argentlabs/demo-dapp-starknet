// app/clickjacking-test/page.tsx
"use client"

export const ClickjackingTest = () => {
  return (
    <div
      id="clickjacking-test"
      className=" bg-gray-900 flex items-center justify-center
      absolute top-0 left-0 z-[999999999] opacity-[0.001]"
      style={{ width: "700px", height: "400px" }}
      onClick={() => console.log("Clickjacking test clicked!")}
    >
      <div className="text-white text-center space-y-4">
        <h1 className="text-2xl font-bold">Clickjacking Test Page</h1>
        <p>
          This page will attempt to cover your iframe with a malicious overlay.
        </p>
        <p>
          Your IntersectionObserver protection should detect and prevent this.
        </p>
      </div>
    </div>
  )
}
