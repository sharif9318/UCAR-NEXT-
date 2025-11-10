import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import TwitterIcon from "@mui/icons-material/Twitter";
import useDeviceDetect from "../hooks/useDeviceDetect";
import { Stack, Box } from "@mui/material";
import moment from "moment";
import { useState } from "react";

const Footer = () => {
  const device = useDeviceDetect();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubscribe = async () => {
    setError("");
    setSuccess("");
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    try {
      // TODO: Replace with real API call
      await new Promise((res) => setTimeout(res, 1000));
      setSuccess("Subscribed successfully!");
      setEmail("");
    } catch (e) {
      setError("Subscription failed. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  if (device == "mobile") {
    return (
      <Stack className={"footer-container"}>
        <Stack className={"main"}>
          <Stack className={"left"}>
            <Box component={"div"} className={"footer-box"}>
              <img src="/img/logo/ucar_logo.svg" alt="" className={"logo"} />
            </Box>
            <Box component={"div"} className={"footer-box"}>
              <span>toll free customer care</span>
              <p>+82 10 4867 2909</p>
            </Box>
            <Box component={"div"} className={"footer-box"}>
              <span>need live support?</span>
              <p>+82 10 4867 2909</p>
            </Box>
            <Box component={"div"} className={"footer-box"}>
              <p>follow us on social media</p>
              <div className={"media-box"}>
                <FacebookOutlinedIcon />
                <TelegramIcon />
                <InstagramIcon />
                <TwitterIcon />
              </div>
            </Box>
          </Stack>
          <Stack className={"right"}>
            <Box component={"div"} className={"bottom"}>
              <div>
                <strong>Popular Search</strong>
                <span>Car for Lease</span>
                <span>Car: Low to High</span>
              </div>
              <div>
                <strong>Quick Links</strong>
                <span>Terms of Use</span>
                <span>Privacy Policy</span>
                <span>Pricing Plans</span>
                <span>Our Services</span>
                <span>Contact Support</span>
                <span>FAQs</span>
              </div>
              <div>
                <strong>Discover</strong>
                <span>Seoul</span>
                <span>Gyeongido</span>
                <span>Busan</span>
                <span>Jejudo</span>
              </div>
            </Box>
          </Stack>
        </Stack>
        <Stack className={"second"}>
          <span>© Nestar - All rights reserved. Nestar {moment().year()}</span>
        </Stack>
      </Stack>
    );
  } else {
    return (
      <Stack className={"footer-container"}>
        <Stack className={"main"}>
          <Stack className={"left"}>
            <Box component={"div"} className={"footer-box"}>
              <img src="/img/logo/ucar_logo.svg" alt="" className={"logo"} />
            </Box>
            <Box component={"div"} className={"footer-box"}>
              <span>toll free customer care</span>
              <p>+82 10 4867 2909</p>
            </Box>
            <Box component={"div"} className={"footer-box"}>
              <span>need live support?</span>
              <p>+82 10 4867 2909</p>
            </Box>
            <Box component={"div"} className={"footer-box"}>
              <p>follow us on social media</p>
              <div className={"media-box"}>
                <FacebookOutlinedIcon />
                <TelegramIcon />
                <InstagramIcon />
                <TwitterIcon />
              </div>
            </Box>
          </Stack>
          <Stack className={"right"}>
            <Box component={"div"} className={"top"}>
              <strong>keep yourself up to date</strong>
              <div>
                <input
                  type="email"
                  placeholder={"Your Email"}
                  aria-label="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                />
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubscribe}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubscribe();
                  }}
                  aria-label="Subscribe to newsletter"
                  style={{ cursor: submitting ? "not-allowed" : "pointer" }}
                >
                  {submitting ? "Subscribing..." : "Subscribe"}
                </button>
              </div>
              {error && (
                <span
                  className="error-message"
                  style={{ color: "red", fontSize: 12 }}
                >
                  {error}
                </span>
              )}
              {success && (
                <span
                  className="success-message"
                  style={{ color: "green", fontSize: 12 }}
                >
                  {success}
                </span>
              )}
            </Box>
            <Box component={"div"} className={"bottom"}>
              <div>
                <strong>Popular Search</strong>
                <span>Car for Lease</span>
                <span>Car: Low to High</span>
              </div>
              <div>
                <strong>Quick Links</strong>
                <span>Terms of Use</span>
                <span>Privacy Policy</span>
                <span>Pricing Plans</span>
                <span>Our Services</span>
                <span>Contact Support</span>
                <span>FAQs</span>
              </div>
              <div>
                <strong>Discover</strong>
                <span>Seoul</span>
                <span>Gyeongido</span>
                <span>Busan</span>
                <span>Jejudo</span>
              </div>
            </Box>
          </Stack>
        </Stack>
        <Stack className={"second"}>
          <span>© Nestar - All rights reserved. Nestar {moment().year()}</span>
          <span>Privacy · Terms · Sitemap</span>
        </Stack>
      </Stack>
    );
  }
};

export default Footer;
