import Header from "@/component/Header";
import Link from "next/link";
import { getAssetPath } from "./utils/assetPath";

export const metadata = {
  title: "404 - Page Not Found | Just Buy Travel",
  description:
    "The page you're looking for doesn't exist or has been moved. Return to Just Buy Travel to find hotels, flights, and travel deals.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="py-5">
        <div className="container">
          <div className="row">
            <div className="no-found-page col-12">
              <div className="text-center">
                <img src={getAssetPath("/404-page/sailor.png")} alt="404" className="m-auto" />
              </div>
              <div className="text-center mt-5">
                <h1>404 - Page Not Found</h1>
                <p className="text-muted">
                  The page you're looking for doesn't exist or has been moved.
                  Return to Just Buy Travel to find hotels, flights, and travel
                  deals.
                </p>
                <Link href="/" className="web-btn mt-3 button_bg2 d-inline-block">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom_images">
          <img src={getAssetPath("/404-page/sailor-left.png")} alt="404" className="me-auto" />
          <img src={getAssetPath("/404-page/sailor-right.png")} alt="404" className="ms-auto" />
        </div>
      </main>
    </>
  );
}
