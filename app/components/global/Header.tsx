'use client'
import { motion } from "framer-motion"
import Link from "next/link"
import FPLogo from "./FPlogo"

export default function Header() {
    return (
        <motion.div 
            whileHover={{ scale: 1.4, translateY: 10 }}
            className="z-10 flex flex-row gap-4 w-full m-auto justify-center items-center p-4 bg-gray-100 fixed top-0 text-md">
            <div className="w-10 h-10"><FPLogo /></div>
            
            <motion.a 
                whileHover={{ scale: 1.2, color: '#E5002D' }}
                href="/" className="flex flex-row gap-1 justify-center">
                Home
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>

            </motion.a>
            <motion.a 
                whileHover={{ scale: 1.2, color: '#E5002D' }} 
                href="/dash"
                className="flex flex-row gap-1 justify-center">
                Dash
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                </svg>

            </motion.a>
            <motion.a 
                whileHover={{ scale: 1.2, color: '#E5002D' }}href="/login" className="flex flex-row gap-1 justify-center">
                Login
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>

            </motion.a>
        </motion.div>
    )
}