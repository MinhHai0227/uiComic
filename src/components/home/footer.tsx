import Container from "@/components/container";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer
      className="bg-slate-950 text-slate-50 dark:bg-slate-800"
      role="contentinfo"
    >
      <Container>
        <div className="py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Logo */}
          <div>
            <Link to="/" className="flex items-center gap-2">
              <img className="size-8" src={logo} alt="TruyenDocViet Logo" />
              <span className="text-lg uppercase">
                truyen<span className="text-amber-500">docviet</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-slate-400">
              © {new Date().getFullYear()} TruyenDocViet. All rights reserved.
            </p>
          </div>

          {/* Thông tin website */}
          <div>
            <h2 className="font-bold text-base mb-4">Thông tin website</h2>
            <ul className="text-sm space-y-2">
              <li>
                <strong>TruyenDocViet</strong> là kho truyện tranh online miễn
                phí, cập nhật liên tục với hàng ngàn bộ truyện hay mỗi ngày.
              </li>
              <li>
                Thể loại nổi bật:{" "}
                <strong>tiên hiệp, kiếm hiệp, ngôn tình, truyện teen</strong> và
                nhiều hơn nữa.
              </li>
              <li>
                Hỗ trợ tối ưu cho <strong>mọi thiết bị</strong>: điện thoại, máy
                tính bảng và máy tính.
              </li>
            </ul>
          </div>

          {/* Chính sách bản quyền */}
          <div>
            <h2 className="font-bold text-base mb-4">Chính sách bản quyền</h2>
            <ul className="text-sm space-y-2">
              <li>
                Nội dung được tổng hợp từ Internet, chúng tôi{" "}
                <strong>không sở hữu bản quyền</strong> các truyện đăng tải.
              </li>
              <li>
                Nếu bạn là <strong>chủ sở hữu bản quyền</strong> và muốn yêu cầu
                gỡ bỏ, xin vui lòng liên hệ với chúng tôi.
              </li>
              <li>
                Mọi yêu cầu sẽ được xử lý <strong>trong vòng 48 giờ</strong>.
              </li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h2 className="font-bold text-base mb-4">Liên hệ & Hỗ trợ</h2>
            <address className="not-italic text-sm space-y-2">
              <div>
                Email:{" "}
                <a href="mailto:shin6464424@gmail.com" className="underline">
                  shin6464424@gmail.com
                </a>
              </div>
              <div>Điện thoại:</div>
            </address>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
