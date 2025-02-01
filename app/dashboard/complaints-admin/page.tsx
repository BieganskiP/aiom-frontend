import PageHeader from "@/components/atoms/layout/PageHeader";
import ComplaintsUpload from "@/components/molecules/forms/ComplaintsUpload";
import ComplaintsList from "@/components/molecules/tables/ComplaintsList";

export default async function page() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Zarządzanie reklamacjami" />
      <ComplaintsUpload />
      <ComplaintsList />
    </div>
  );
}
