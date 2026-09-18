import { Metadata } from "next";
import { checkAdminAuth } from "@/_actions/admin-stock-actions";
import AdminLogin from "@/_components/admin/admin-login";
import StockManager from "@/_components/admin/stock-manager";

import strainsData from "@/_data/strains-data.json";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Stock Admin",
  robots: { index: false, follow: false },
};

const AdminPage = async () => {
  const isAuthenticated = await checkAdminAuth();

  const strains = strainsData
    .filter((strain) => strain.title !== "")
    .map(({ title, inStock }) => ({ title, inStock }))
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="max-w-[800px] grid gap-10 py-15 mx-auto px-5 desktop:px-10">
      <h2>Stock Admin</h2>
      {isAuthenticated ? (
        <>
          <p>
            Tick the strains that are in stock, untick the ones that are out of
            stock, then save your changes.
          </p>
          <StockManager strains={strains} />
        </>
      ) : (
        <AdminLogin />
      )}
    </div>
  );
};

export default AdminPage;
