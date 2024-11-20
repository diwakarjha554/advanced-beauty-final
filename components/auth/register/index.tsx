'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdEmail, MdLock, MdOutlineDriveFileRenameOutline, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import toast from 'react-hot-toast';

type CustomError = {
    errors?: { message: string }[];
    message?: string;
};

const RegisterForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // setIsLoading(true);
        // setError('');

        // if (!isLoaded) {
        //     setIsLoading(false);
        //     return;
        // }

        // try {
        //     await signUp.create({
        //         firstName,
        //         lastName,
        //         emailAddress: email,
        //         password,
        //     });

        //     await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        //     setPendingVerification(true);
        // } catch (err: unknown) {
        //     const customError = err as CustomError;
        //     setError(
        //         customError.errors?.[0]?.message || customError.message || 'An error occurred during registration.'
        //     );
        // } finally {
        //     setIsLoading(false);
        // }
        toast.error('Currently Unavailable! Please continue with Google');
    }

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        // if (!isLoaded) return;

        // try {
        //     const completeSignUp = await signUp.attemptEmailAddressVerification({
        //         code,
        //     });
        //     if (completeSignUp.status === 'complete') {
        //         await setActive({ session: completeSignUp.createdSessionId });
        //         router.push('/');
        //     }
        // } catch (err: unknown) {
        //     const customError = err as CustomError;
        //     setError(
        //         customError.errors?.[0]?.message ||
        //             customError.message ||
        //             'An error occurred during email verification.'
        //     );
        // }
    };

    return (
        <div className="max-w-sm mx-auto flex flex-col gap-6">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            {!pendingVerification ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="First name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full border rounded-md py-2 pl-10 pr-3 focus:outline-none"
                            disabled={isLoading}
                            required
                        />
                        <MdOutlineDriveFileRenameOutline size={20} className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full border rounded-md py-2 pl-10 pr-3 focus:outline-none"
                            disabled={isLoading}
                            required
                        />
                        <MdOutlineDriveFileRenameOutline size={20} className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                    </div>
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border rounded-md py-2 pl-10 pr-3 focus:outline-none"
                            disabled={isLoading}
                            required
                        />
                        <MdEmail size={20} className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border rounded-md py-2 pl-10 pr-10 focus:outline-none"
                            disabled={isLoading}
                            required
                        />
                        <MdLock size={20} className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-400 focus:outline-none"
                        >
                            {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                        </button>
                    </div>
                    <button type='submit' className='bg-[#D9C1A3] rounded-sm py-2 font-medium' disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Signup'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleVerify} className="flex flex-col gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Enter verification code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full border rounded-md py-2 pl-10 pr-3 focus:outline-none"
                            required
                        />
                        <MdEmail size={20} className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                    </div>
                    <button type='submit' className='bg-[#D9C1A3] rounded-sm py-2 font-medium'>
                        Verify Email
                    </button>
                </form>
            )}
        </div>
    );
};

export default RegisterForm;
