import {useState, useContext} from "react";
import "../../components/Common/Style/formInput.css";
import {Link, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {client} from "../../utils/api";
import {allUsers} from "../../utils/queryKeys";
import {useMutation} from "react-query";
import {toast} from "react-toastify";
import {UserContext} from "../../Context/UserContext";

const Register = () => {
  const {currentUser, setCurrentUser} = useContext(UserContext);
  const navigate = useNavigate();

  const [values, setValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const onChange = (e) => {
    setValues({...values, [e.target.name]: e.target.value});
  };

  // FORM
  const {register, handleSubmit, reset, formState: {errors}} = useForm();

  async function postForm(data) {
    const {first_name, last_name, email, password} = data

    return await client.post(allUsers, {
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password
    })
  }

  const {mutateAsync: sendData} = useMutation(postForm);

  const notifyError = () => toast.error("Registration Failed.")

  const onSubmit = async (data, e) => {
    try {
      const response = await sendData(data)
      reset()
      setCurrentUser(response.config.data)
      navigate("/");
    } catch (err) {
      notifyError()
      reset()
      // throw new Error(err)
    }
  }

  // ELEMENT
  return (
    <div className="app">
      <form method="post" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="reg-log">Register</h1>
        {/* FIRST NAME */}
        <div key="register-name-1" className="formInput">
          <label>First Name</label>
          <input
            id="first_name"
            {...register("first_name", {
              required: "Name is required",
              pattern: {
                value: /^[A-Za-z0-9]{3,16}$/,
                message: "Name should be 3-16 characters and shouldn't include any special character!"
              }
            })}
            type="text"
            placeholder="First Name"
            value={values.first_name ?? ""}
            onChange={onChange}
          />
          <span className="error">{errors.first_name?.message}</span>
        </div>

        {/* LAST NAME */}
        <div key="register-last-2" className="formInput">
          <label>Last Name</label>
          <input
            id="last_name"
            {...register("last_name", {
              required: "Last name is required",
              pattern: {
                value: /^[A-Za-z0-9]{3,16}$/,
                message: "Last Name should be 3-16 characters and shouldn't include any special character!"
              }
            })}
            type="text"
            placeholder="Last Name"
            value={values.last_name ?? ""}
            onChange={onChange}
          />
          <span className="error">{errors.last_name?.message}</span>
        </div>

        {/* Email */}
        <div key="register-email-3" className="formInput">
          <label>Email</label>
          <input
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: "Email is invalid"
              }
            })}
            type="text"
            placeholder="Email"
            value={values.email ?? ""}
            onChange={onChange}
          />
          <span className="error">{errors.email?.message}</span>
        </div>

        {/* PASSWORD */}
        <div key="register-password-3" className="formInput">
          <label>Password</label>
          <input
            id="password"
            {...register("password", {
              required: "Password is required",
              pattern: {
                value: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
                message: "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!"
              }
            })}
            type="password"
            placeholder="Password"
            value={values.password ?? ""}
            onChange={onChange}
          />
          <span className="error">{errors.password?.message}</span>
        </div>


        <button className="reg-form" type="submit">Submit</button>
        <div className="reg-link">
          <Link to={'/login'}>Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
