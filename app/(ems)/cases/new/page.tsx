import { CaseForm } from "@/src/components/ems/case-form";

export default function NewCasePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">救急事案入力</h1>
      <p className="text-sm text-slate-700">
        MVPでは個人情報必須項目と初回バイタル（JCS）を最短入力できる構成です。
      </p>
      <CaseForm />
    </div>
  );
}
