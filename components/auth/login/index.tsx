import React from 'react';
import { MdEmail, MdLock } from 'react-icons/md';
import toast from 'react-hot-toast';

const LoginForm = () => {

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast.error('Currently unavailable! Please continue with Google');
    };

    return (
        <div className="max-w-sm mx-auto flex flex-col gap-3">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="relative">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        className="w-full border rounded-md py-2 pl-10 pr-3 focus:outline-none"
                    />
                    <MdEmail size={20} className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                </div>
                <div className="relative">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        className="w-full border rounded-md py-2 pl-10 pr-3 focus:outline-none"
                    />
                    <MdLock size={20} className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                </div>
                <button type="submit" className="bg-[#D9C1A3] rounded-sm py-2 font-medium">
                    Login with Email
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
