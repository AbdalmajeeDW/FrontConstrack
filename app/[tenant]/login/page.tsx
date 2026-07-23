import TenantAdminLoginForm from "@/components/tenantAdmin/TenantAdminLoginForm";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;


  return <TenantAdminLoginForm tenantName={tenant} />;
}