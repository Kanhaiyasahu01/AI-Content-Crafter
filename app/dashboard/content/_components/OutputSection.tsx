'use client';
import React from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { marked } from "marked"; // Install marked using npm or yarn

interface PROPS {
  aiOutput: string;
}
const OutputSection = ({ aiOutput }: PROPS) => {
  return (
    <div className="bg-white shadow-lg border rounded-lg">
      <div className="flex justify-between items-center p-5">
        <h2 className="font-medium text-lg">Your Result</h2>
        <Button
          className="flex gap-2"
          onClick={() => navigator.clipboard.writeText(aiOutput)}
        >
          <Copy className="w-4 h-4" />
          Copy
        </Button>
      </div>

      <div
        className="p-5"
        dangerouslySetInnerHTML={{ __html: marked(aiOutput) }}
      />
    </div>
  );
};

export default OutputSection;
