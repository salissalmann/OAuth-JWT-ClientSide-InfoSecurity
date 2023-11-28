import { useContext, useState } from "react";
import { circlePremedLogo } from "../../assets";
import Badge from "../../components/UiComponents/Badges";
import { Input, Label } from "../../components/UiComponents/Forms";
import { SubTitle } from "../../components/UiComponents/Headings";
import Image from "../../components/UiComponents/Image";
import AuthContext from "../../context/AuthContext";
import useAuth from "../../hooks/useAuth";
import apiClient from "../../services/api/apiClient";
import { useNavigate } from 'react-router-dom'
import MyToast, { showToast } from "../../components/UiComponents/MyToast";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate()

  const context = useContext(AuthContext)

  const handleInputChange = (name: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const authHook = useAuth();

  /*
  useEffect(() => {
    //PRINT MY COOKIES
    console.log(document.cookie)
  }, [])
  */

  const Submit = async () => {
    try {
      const body = {
        email: formData.email,
        password: formData.password
      }
      const response = await apiClient.post(`/api/auth/login`, body);
      console.log(response)
      const accessToken = response.data.data?.AccessToken;
      const refreshToken = response.data.data?.RefreshToken;
      if (!accessToken) throw new Error('An Error Occured');
      document.cookie = `accessToken=${accessToken}; path=/;`;
      document.cookie = `refreshToken=${refreshToken}; path=/;`;
      if (response.status === 201) {
        navigate('/questions')
      }
      else (
        showToast(
          'Invalid Credentials',
          'error',
          'Please use your email and password from your premed.pk account. If you do not have access or encounter invalid credentials, kindly reach out to Hasnain Mankani at 0302-8609690.',
        )
      )

      const user = response.data.data?.user
      authHook?.setAuth({ user, accessToken });
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <section className="bg-gray-50 ">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md  sm:p-8  ">
          <div className=" space-y-4 md:space-y-6 ">
            <div className="mx-auto flex items-center justify-center">
              <Image src={circlePremedLogo} size="w-32 h-32" disabled={true} />
            </div>
            <SubTitle className="text-center"> Login</SubTitle>
            <h1>{context?.name || ''}</h1>

            <form className="space-y-4 md:space-y-6" action="#">
              <Badge
                label="Please use your email and password from your premed.pk account. If you do not have access or encounter invalid credentials, kindly reach out to Hasnain Mankani at 0302-8609690."
                type="info"
                rounded="md"
                textSize="sm"
              />
              <div>
                <Label required={true}> Your email</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label required={true}> Password</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div></div>
              <div className="flex items-center justify-center">
                <a
                  href="#"
                  className="text-sm font-medium  hover:underline cursor-pointer"
                >
                  Forgot password?
                  <span className="text-primary"> Reset Here</span>
                </a>
              </div>
              <div className="w-full">
                <button
                  className="w-full py-3 mt-4 text-white bg-primary rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-opacity-50"
                  onClick={Submit}
                >
                  Login
                </button>
                <MyToast />

              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
