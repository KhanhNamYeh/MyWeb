import React from 'react';
import './user.css';
import Navbar from '../HeadAndFooter/Navbar';
import Footer from '../HeadAndFooter/Footer';
import ai from "/images/ai.png";
import { Favorite } from '@mui/icons-material';

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
          <div className="col-lg-6 col-md-12">
            <div className="user-profile">
              <div className="user-profile-img"><img src={ai} alt="User" className="user-image" /></div>
              <div className="user-profile-container">
                <h2>Account Information</h2>

                <div className="user-profile-info row">
                    <div className="user-info-item col-12">
                        <span className="label">Name:</span>
                        <span className="value" id="user-name">{userData.name}</span>
                    </div>
                    <div className="user-info-item col-lg-6 col-md-12">
                        <span className="label">Login:</span>
                        <span className="value" id="user-login">{userData.login}</span>
                    </div>
                    <div className="user-info-item col-6">
                        <span className="label">Password:</span>
                        <span className="value" id="user-login">{hidePassword(userData.password)}</span>
                    </div>
                    <div className="user-info-item col-12">
                        <span className="label">Email:</span>
                        <span className="value" id="user-email">{hideMail(userData.email)}</span> </div>
                    <div className="user-info-item col-lg-6 col-md-12">
                        <span className="label">Phone:</span>
                        <span className="value" id="user-phone">{userData.phone}</span> </div>
                    <div className="user-info-item col-6">
                        <button>Edit</button>
                    </div>
                  </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12">
            <div className="user-likes has-waves">
              <div className="wave" />
              <div className="wave" />
              <div className="wave" />

              <div className="user-likes-content">
                <div className="user-likes-author">Favorite Authors</div>
                <div className="user-likes-tag">
                  <img src={ai} alt="User" className="user-image" />
                  <div className="user-info">
                    <a>Harlem Shuffle</a>
                    <a>New York</a>
                  </div>
                  <div className="user-actions">
                    <a className="like-count">3</a>
                    <a className="favorite-action"><Favorite /></a>
                  </div>
                </div>
                <div className="user-likes-tag">
                  <img src={ai} alt="User" className="user-image" />
                  <div className="user-info">
                    <a>Harlem Shuffle</a>
                    <a>New York</a>
                  </div>
                  <div className="user-actions">
                    <a className="like-count">3</a>
                    <a className="favorite-action"><Favorite /></a>
                  </div>
                </div>
                <div className="user-likes-tag">
                  <img src={ai} alt="User" className="user-image" />
                  <div className="user-info">
                    <a>Harlem Shuffle</a>
                    <a>New York</a>
                  </div>
                  <div className="user-actions">
                    <a className="like-count">3</a>
                    <a className="favorite-action"><Favorite /></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="user-history">
              <h2>Transaction History</h2>

              <div className="table-responsive">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Erasure</td>
                      <td>2</td>
                      <td><span className="status status-delivered">Delivered</span></td>
                    </tr>
                    <tr>
                      <td>Erasure</td>
                      <td>2</td>
                      <td><span className="status status-processing">On the way</span></td>
                    </tr>
                    <tr>
                      <td>Erasure</td>
                      <td>2</td>
                      <td><span className="status status-cancelled">Checking</span></td>
                    </tr>
                  </tbody>
                </table>
                <a href="/notification" className="user-history-full">Details</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </>
);

export default User;