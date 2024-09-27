import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Metadata from '../Layout/MetaData';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearErrors } from '../../Redux/actions/userActions';

const Register = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, error, loading } = useSelector(state => state.auth);
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
    });

    const { name, email, password } = user;

    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg');

    let navigate = useNavigate();
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
        if (error) {
            console.log(error);
            dispatch(clearErrors());
        }
    }, [error, isAuthenticated, navigate, dispatch]);

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('password', password);
        formData.set('avatar', avatar);

        dispatch(register(formData));
    };

    const onChange = e => {
        if (e.target.name === 'avatar') {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    };

    return (
        <Fragment>
            <Metadata title={'Register User'} />

            <div className="row wrapper justify-content-center align-items-center vh-100">
                <div className="col-10 col-lg-6 col-md-8">
                    <form className="shadow-lg p-4" onSubmit={submitHandler} encType='multipart/form-data'>
                        <h1 className="mb-4 text-center">Register</h1>

                        <div className="form-group mb-3">
                            <label htmlFor="name_field">Name</label>
                            <input
                                type="text"
                                id="name_field"
                                className="form-control"
                                name='name'
                                value={name}
                                onChange={onChange}
                                required
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                name='email'
                                value={email}
                                onChange={onChange}
                                required
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="password_field">Password</label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control"
                                name='password'
                                value={password}
                                onChange={onChange}
                                required
                            />
                        </div>

                        <div className='form-group mb-4'>
                            <label htmlFor='avatar_upload'>Avatar</label>
                            <div className='d-flex align-items-center mt-2'>
                                <figure className='avatar mr-3'>
                                    <img
                                        src={avatarPreview}
                                        className='rounded-circle'
                                        alt='Avatar Preview'
                                        width="80"
                                        height="80"
                                    />
                                </figure>
                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='avatar'
                                        className='custom-file-input'
                                        id='customFile'
                                        accept="images/*"
                                        onChange={onChange}
                                    />
                                    <label className='custom-file-label' htmlFor='customFile'>
                                        Choose Avatar
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button
                            id="register_button"
                            type="submit"
                            className="btn btn-block btn-primary py-2"
                        >
                            {loading ? 'Registering...' : 'REGISTER'}
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    );
};

export default Register;
