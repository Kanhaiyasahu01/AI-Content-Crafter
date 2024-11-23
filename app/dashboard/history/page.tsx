import { db } from '@/utils/db';
import { AIOutput } from '@/utils/schema';
import { currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import React from 'react';
import CopyButton from './_components/CopyButton';

const History = async () => {
  const user = await currentUser();

  const emailAddress = user?.emailAddresses[0]?.emailAddress;

  if (!emailAddress) {
    console.error('No email address found for the current user.');
    return <div>No user found</div>;
  }

  const results = await db
    .select()
    .from(AIOutput)
    .where(eq(AIOutput.createdBy, emailAddress));
  return (
    <div className="w-full p-6">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">History</h1>
        <p className="text-gray-600">Search your previously generated AI content</p>
      </div>

      {/* Table Layout */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          {/* Table Head */}
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left font-semibold text-gray-700">TEMPLATE</th>
              <th className="border px-4 py-2 text-left font-semibold text-gray-700">AI RESP</th>
              <th className="border px-4 py-2 text-left font-semibold text-gray-700">DATE</th>
              <th className="border px-4 py-2 text-left font-semibold text-gray-700">WORDS</th>
              <th className="border px-4 py-2 text-left font-semibold text-gray-700">COPY</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {results && results.length > 0 ? (
              results.map((result, index) => (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  {/* Template Slug */}
                  <td className="border px-4 py-2">
                    {result?.templateSlug.replace(/-/g, ' ')}
                  </td>

                  {/* AI Response */}
                  <td className="border px-4 py-2 truncate max-w-lg">
                  <div dangerouslySetInnerHTML={{ __html: result?.aiResponse?.substring(0,100)+"... Copy to see more..." || '' }} />
                  </td>

                  {/* Date */}
                  <td className="border px-4 py-2">
                    {result.createdAt}
                  </td>

                  {/* Word Count */}
                  <td className="border px-4 py-2">
                    {result?.aiResponse?.length}
                  </td>

                  {/* Copy Button */}
                 <td className="border px-4 py-2 text-center">
                  <CopyButton content={result.aiResponse} />
                </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
