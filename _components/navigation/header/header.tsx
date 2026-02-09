import { MobileHeader } from "./mobile/mobile-header";
import { DesktopHeader } from "./desktop/desktop-header";

export default function Header() {
  return (
    <header className="sticky top-0 left-0 mx-auto bg-black z-50 ease-in-out duration-300 overflow-y-hidden border-b-4 border-green">
      <div className="max-w-[1280px] mx-auto relative">
        <MobileHeader />
        <DesktopHeader />
      </div>
    </header>
  );
}
