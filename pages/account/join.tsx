import React, { useCallback, useState } from "react";
import { NextPage } from "next";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
} from "@mui/material";
import { useRouter } from "next/router";
import { logIn, signUp } from "../../libs/auth";
import { sweetMixinErrorAlert } from "../../libs/sweetAlert";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import withI18n from "../../libs/i18n/withI18n";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

// Social SVGs as components
const GoogleIcon = () => (
  <svg xmlSpace="preserve" viewBox="0 0 512 512" width="20" version="1.1">
    <path
      d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456C103.821,274.792,107.225,292.797,113.47,309.408z"
      style={{ fill: "#FBBB00" }}
    ></path>
    <path
      d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z"
      style={{ fill: "#518EF8" }}
    ></path>
    <path
      d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z"
      style={{ fill: "#28B446" }}
    ></path>
    <path
      d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0C318.115,0,375.068,22.126,419.404,58.936z"
      style={{ fill: "#F14336" }}
    ></path>
  </svg>
);
const AppleIcon = () => (
  <svg
    xmlSpace="preserve"
    viewBox="0 0 22.773 22.773"
    width="20"
    height="20"
    version="1.1"
  >
    <g>
      <g>
        <path d="M15.769,0c0.053,0,0.106,0,0.162,0c0.13,1.606-0.483,2.806-1.228,3.675c-0.731,0.863-1.732,1.7-3.351,1.573 c-0.108-1.583,0.506-2.694,1.25-3.561C13.292,0.879,14.557,0.16,15.769,0z"></path>
        <path d="M20.67,16.716c0,0.016,0,0.03,0,0.045c-0.455,1.378-1.104,2.559-1.896,3.655c-0.723,0.995-1.609,2.334-3.191,2.334 c-1.367,0-2.275-0.879-3.676-0.903c-1.482-0.024-2.297,0.735-3.652,0.926c-0.155,0-0.31,0-0.462,0 c-0.995-0.144-1.798-0.932-2.383-1.642c-1.725-2.098-3.058-4.808-3.306-8.276c0-0.34,0-0.679,0-1.019 c0.105-2.482,1.311-4.5,2.914-5.478c0.846-0.52,2.009-0.963,3.304-0.765c0.555,0.086,1.122,0.276,1.619,0.464 c0.471,0.181,1.06,0.502,1.618,0.485c0.378-0.011,0.754-0.208,1.135-0.347c1.116-0.403,2.21-0.865,3.652-0.648 c1.733,0.262,2.963,1.032,3.723,2.22c-1.466,0.933-2.625,2.339-2.427,4.74C17.818,14.688,19.086,15.964,20.67,16.716z"></path>
      </g>
    </g>
  </svg>
);

const Join: NextPage = () => {
  const router = useRouter();
  const device = useDeviceDetect();
  const [input, setInput] = useState({
    nick: "",
    password: "",
    phone: "",
    type: "USER",
  });
  const [loginView, setLoginView] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState(false);

  /** HANDLERS **/
  const viewChangeHandler = (state: boolean) => {
    setLoginView(state);
  };

  const checkUserTypeHandler = (e: any) => {
    const checked = e.target.checked;
    if (checked) {
      const value = e.target.name;
      handleInput("type", value);
    } else {
      handleInput("type", "USER");
    }
  };

  const handleInput = useCallback((name: any, value: any) => {
    setInput((prev) => {
      return { ...prev, [name]: value };
    });
  }, []);

  const doLogin = useCallback(async () => {
    console.warn(input);
    try {
      await logIn(input.nick, input.password);
      await router.push(`${router.query.referrer ?? "/"}`);
    } catch (err: any) {
      await sweetMixinErrorAlert(err.message);
    }
  }, [input]);

  const doSignUp = useCallback(async () => {
    console.warn(input);
    try {
      await signUp(input.nick, input.password, input.phone, input.type);
      await router.push(`${router.query.referrer ?? "/"}`);
    } catch (err: any) {
      await sweetMixinErrorAlert(err.message);
    }
  }, [input]);

  console.log("+input: ", input);

  if (device === "mobile") {
    return <div>LOGIN MOBILE</div>;
  } else {
    return (
      <div className="uiverse-login-root">
        <div className="uiverse-animation-container">
          {[...Array(50)].map((_, i) => (
            <span key={i} style={{ "--i": i } as React.CSSProperties}></span>
          ))}
        </div>
        <div className="uiverse-login-box">
          <h2>{loginView ? "Login" : "Signup"}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              loginView ? doLogin() : doSignUp();
            }}
            autoComplete="off"
          >
            <div className="input-box">
              <input
                type="text"
                value={input.nick}
                required
                onChange={(e) => handleInput("nick", e.target.value)}
                onKeyDown={(event) => {
                  if (event.key == "Enter" && loginView) doLogin();
                  if (event.key == "Enter" && !loginView) doSignUp();
                }}
              />
              <label>Nickname</label>
            </div>
            <div className="input-box">
              <input
                type={showPassword ? "text" : "password"}
                value={input.password}
                required
                onChange={(e) => handleInput("password", e.target.value)}
                onKeyDown={(event) => {
                  if (event.key == "Enter" && loginView) doLogin();
                  if (event.key == "Enter" && !loginView) doSignUp();
                }}
              />
              <label>Password</label>
              <button
                type="button"
                className={`toggle-password-btn${
                  showPassword ? " visible" : ""
                }`}
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {!loginView && (
              <div className="input-box">
                <input
                  type="text"
                  value={input.phone}
                  required
                  onChange={(e) => handleInput("phone", e.target.value)}
                  onKeyDown={(event) => {
                    if (event.key == "Enter") doSignUp();
                  }}
                />
                <label>Phone</label>
              </div>
            )}
            {loginView && (
              <div className="forgot-pass">
                <a>Lost your password?</a>
              </div>
            )}
            <button
              className="btn"
              type="submit"
              disabled={
                loginView
                  ? input.nick === "" || input.password === ""
                  : input.nick === "" ||
                    input.password === "" ||
                    input.phone === "" ||
                    input.type === ""
              }
            >
              {loginView ? "Login" : "Signup"}
            </button>
          </form>
          <p className="p">
            {loginView ? (
              <>
                Don't have an account?{" "}
                <span className="span" onClick={() => viewChangeHandler(false)}>
                  Sign Up
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span className="span" onClick={() => viewChangeHandler(true)}>
                  Login
                </span>
              </>
            )}
          </p>
          <p className="p line">Or With</p>
          <div className="flex-row">
            <button
              className="btn google"
              type="button"
              aria-label="Sign in with Google"
            >
              <GoogleIcon /> Google
            </button>
            <button
              className="btn apple"
              type="button"
              aria-label="Sign in with Apple"
            >
              <AppleIcon /> Apple
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default withI18n()(withLayoutBasic(Join));
