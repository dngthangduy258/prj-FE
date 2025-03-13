import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-4 pb-2 mt-5">
      <div className="container text-center">
        <div className="row">
          <div className="col-md-3 mb-3">
            <h5>Antoree</h5>
            <p>Giáo dục ngoại ngữ online</p>
          </div>

          <div className="col-md-6 mb-3">
            <h5>Liên hệ</h5>
            <ul className="list-unstyled">
              <li>Địa chỉ: 187/7 Điện Biên Phủ, P. Đa Kao, Q 1, TP Hồ Chí Minh, Việt Nam</li>
              <li>Hotline: 1800 6806</li>
              <li>Email: hello@antoree.com</li>
            </ul>
          </div>

          <div className="col-md-3 mb-3">
            <h5>Theo dõi chúng tôi</h5>
            <a href="https://www.facebook.com/antoree.co/?locale=vi_VN" className="text-white me-2">
              <i  className="bi bi-facebook"></i> Facebook
            </a><br />
            {/* <a href="#" className="text-white me-2">
              <i className="bi bi-instagram"></i> Instagram
            </a> */}
          </div>
        </div>

        <hr className="bg-white" />

        <p className="mb-0">&copy; 2025 Antoree Pte.Ltd. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
