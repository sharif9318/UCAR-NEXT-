import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import TwitterIcon from "@mui/icons-material/Twitter";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
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
      setSuccess("You're subscribed! Check your inbox for updates.");
      setEmail("");
    } catch (e) {
      setError("Subscription failed. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubscribe();
    }
  };

  if (device === "mobile") {
    return (
      <Stack className={"footer-container"}>
        <Stack className={"main"}>
          <Stack className={"left"}>
            <Box component={"div"} className={"footer-box brand-logo"}>
              <p className={"logo-text"}>UCAR</p>
            </Box>
            <Box component={"div"} className={"footer-box contact-box"}>
              <span>Questions? Call</span>
              <p>
                <PhoneOutlinedIcon />
                +82 10 6558 9499
              </p>
            </Box>
            <Box component={"div"} className={"footer-box"}>
              <div className={"media-box"}>
                <a
                  href="https://www.facebook.com/sharif.dilmurodov"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <FacebookOutlinedIcon />
                </a>
                <a
                  href="https://telegram.org/@Sharifzzzz"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                >
                  <TelegramIcon />
                </a>
                <a
                  href="https://www.instagram.com/sheriff_aka/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://twitter.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <TwitterIcon />
                </a>
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
          <span>© {moment().year()} UCAR. All rights reserved.</span>
        </Stack>
      </Stack>
    );
  } else {
    return (
      <Stack className={"footer-container"}>
        <Stack className={"main"}>
          <Stack className={"left"}>
            <Box component={"div"} className={"footer-box brand-logo"}>
              <p className={"logo-text"}>UCAR</p>
            </Box>
            <Box component={"div"} className={"footer-box contact-box"}>
              <span>Questions? Call</span>
              <p>
                <PhoneOutlinedIcon />
                +82 10 6558 9499
              </p>
            </Box>
            <Box component={"div"} className={"footer-box"}>
              <div className={"media-box"}>
                <a
                  href="https://www.facebook.com/sharif.dilmurodov"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <FacebookOutlinedIcon />
                </a>
                <a
                  href="https://telegram.org/@Sharifzzzz"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                >
                  <TelegramIcon />
                </a>
                <a
                  href="https://www.instagram.com/sheriff_aka/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://twitter.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <TwitterIcon />
                </a>
              </div>
            </Box>
          </Stack>
          <Stack className={"right"}>
            <Box component={"div"} className={"top"}>
              <strong>Questions? Contact us.</strong>
              <span className="subtitle">
                Get updates on new cars and exclusive deals
              </span>
              <div className="input-wrapper">
                <div className="input-container">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email address"
                    aria-label="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={submitting}
                  />
                </div>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubscribe}
                  aria-label="Subscribe to newsletter"
                >
                  {submitting ? "Subscribing..." : "Get Started"}
                </button>
              </div>
              {error && (
                <div className="message error">
                  <ErrorOutlineIcon />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="message success">
                  <CheckCircleOutlineIcon />
                  <span>{success}</span>
                </div>
              )}
            </Box>
            <Box component={"div"} className={"bottom"}>
              <div>
                <strong>Popular Search</strong>
                <span>Car for Lease</span>
                <span>Car: Low to High</span>
                <span>Luxury Vehicles</span>
                <span>SUVs</span>
              </div>
              <div>
                <strong>Company</strong>
                <span>About Us</span>
                <span>Careers</span>
                <span>Press</span>
                <span>Contact Us</span>
              </div>
              <div>
                <strong>Support</strong>
                <span>Help Center</span>
                <span>Terms of Use</span>
                <span>Privacy Policy</span>
                <span>Cookie Preferences</span>
              </div>
            </Box>
          </Stack>
        </Stack>
        <Stack className={"second"}>
          <span>© {moment().year()} UCAR, Inc.</span>
          <span>Privacy · Terms · Help</span>
        </Stack>
      </Stack>
    );
  }
};

export default Footer;
