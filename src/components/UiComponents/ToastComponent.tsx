import MyToast, { showToast } from "./MyToast";
import { ErrorIcon, LoadingIconFilled } from "./Icons";

const ToastComponent = () => {
  return (
    <>
      <MyToast />
      <div className="flex space-x-4">
        <button
          onClick={() =>
            showToast(
              "This is a success toast",
              "success",
              <LoadingIconFilled />
            )
          }
        >
          Show Success Toast
        </button>

        <button
          onClick={() =>
            showToast("This is an error toast", "error", <ErrorIcon />)
          }
        >
          Show Error Toast
        </button>

        <button onClick={() => showToast("This is a warning toast", "warning")}>
          Show Warning Toast
        </button>

        <button onClick={() => showToast("This is an info toast", "info")}>
          Show Info Toast
        </button>
      </div>
    </>
  );
};

export default ToastComponent;
