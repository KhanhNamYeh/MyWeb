import React from 'react';
import './user.css';
import Navbar from '../HeadAndFooter/Navbar';
import Footer from '../HeadAndFooter/Footer';
import ai from "/images/ai.png";

const userData = {name: "Erasure", login: "abc123", password: "123456", email: "abcde@gmail.com", phone: "0123456"};

function hidePassword(password) {
  return password.replace(/./g, '*');
}

function hideMail(email) {
  const [username, domain] = email.split('@');
  const hiddenUsername = username.slice(0, 2) + '*'.repeat(username.length - 2);
  return `${hiddenUsername}@${domain}`;
}

const User = () => (
  <>
    <Navbar />
    <div className="container mt-5 mb-5">
      <div className="user-container">
        <div className="row">
          <div className="col-6">
            <div className="user-profile">
              <div className="user-profile-img"><img src={ai} alt="User" className="user-image" /></div>
              <div className="user-profile-container">
                <h2>Thông tin tài khoản</h2>

                <div className="user-profile-info row">
                    <div className="user-info-item col-12">
                        <span className="label">Tên:</span>
                        <span className="value" id="user-name">{userData.name}</span> 
                    </div>
                    <div className="user-info-item col-6">
                        <span className="label">Đăng nhập:</span>
                        <span className="value" id="user-login">{userData.login}</span> 
                    </div>
                    <div className="user-info-item col-6">
                        <span className="label">Mật khẩu:</span>
                        <span className="value" id="user-login">{hidePassword(userData.password)}</span> 
                    </div>
                    <div className="user-info-item col-12">
                        <span className="label">Email:</span>
                        <span className="value" id="user-email">{hideMail(userData.email)}</span> </div>
                    <div className="user-info-item col-6">
                        <span className="label">Điện thoại:</span>
                        <span className="value" id="user-phone">{userData.phone}</span> </div>
                    <div className="user-info-item col-6">
                        <button>Sửa</button>
                         </div>
                    </div>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="user-likes">
              <div>Mục ưa thích</div>
            </div>
            <div className="user-history">

            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </>
);

export default User;