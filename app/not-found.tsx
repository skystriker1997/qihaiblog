import Link from 'next/link';


export default function NotFound() {
  return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#dddddd]">
        <div className="text-center">
          <h1 className="text-[#5a6a7a] text-9xl font-bold mb-6">
            404
          </h1>
          <p className="text-[#1a2a3a] text-xl mb-8">
            页面未找到
          </p>
          <Link
              href="/"
              className="inline-block px-6 py-3 bg-[#1a2a3a] text-[#dddddd] font-medium rounded-lg"
          >
            返回首页
          </Link>
        </div>
      </div>
  );
}

