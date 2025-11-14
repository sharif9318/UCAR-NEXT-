import React, { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

interface AuthPopupProps {
  open: boolean;
  onClose: () => void;
  onLogin: (nick: string, password: string) => Promise<void>;
}

const AuthPopup: React.FC<AuthPopupProps> = ({ open, onClose, onLogin }) => {
  const [nick, setNick] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation("common");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nick.trim() || !password.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      await onLogin(nick, password);
      setNick("");
      setPassword("");
      setShowPassword(false);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (!isLoading) {
      onClose();
    }
  };

  const handlePopupClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSignUpClick = () => {
    onClose();
    router.push("/account/join");
  };

  return (
    <div className="auth-popup-overlay" onClick={handleOverlayClick}>
      <div className="auth-popup" onClick={handlePopupClick}>
        <button
          className="auth-popup-close"
          onClick={onClose}
          aria-label="Close popup"
          disabled={isLoading}
        >
          ×
        </button>
        <h3>{t("Login")}</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <input
              type="text"
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              placeholder={t("Nickname") || "Nickname"}
              required
              disabled={isLoading}
              autoComplete="username"
            />
          </div>
          <div className="input-box">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("Password") || "Password"}
              required
              disabled={isLoading}
              autoComplete="current-password"
            />
            <button
              type="button"
              className={`toggle-password-btn${showPassword ? " visible" : ""}`}
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={isLoading}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          <button className="btn btn-login" type="submit" disabled={isLoading}>
            {isLoading ? t("Logging in...") || "Logging in..." : t("Login")}
          </button>
          <button
            className="btn btn-signup"
            type="button"
            onClick={handleSignUpClick}
            disabled={isLoading}
          >
            {t("Register") || "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPopup;
