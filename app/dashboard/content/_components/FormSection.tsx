import React from "react";
import { TEMPLATE } from "../../_components/TemplateListSection";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PROPS {
  selectedTemplate?: TEMPLATE;
}
const FormSection = ({ selectedTemplate }: PROPS) => {
  return (
    <div className="p-5 shadow-md border rounded-lg ">
      {/* @ts-ignore */}
      <Image src={selectedTemplate?.icon} alt="icon" width={70} height={70} />
      <h2 className="font-bold text-2xl mb-2 text-primary">
        {selectedTemplate?.name}
      </h2>
      <p className="text-gray-500 text-sm">{selectedTemplate?.desc}</p>

      <form className="mt-6">
        {selectedTemplate?.form?.map((item, index) => (
          <div key={index} className="my-2 flex flex-col gap-2 mb-7">
            <label className="font-bold">{item.label}</label>
            {item.field == "input" ? (
              <Input />
            ) : item.field == "textarea" ? (
              <Textarea />
            ) : null}
          </div>
        ))}
      </form>
    </div>
  );
};

export default FormSection;
