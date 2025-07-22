import React from 'react'

const ModalWrapper = ({ children }) => {
    return (

        <div className="fixed inset-0 bg-black bg-opacity-50 z-10 flex justify-center items-center py-6" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(2px)' }}>
            <div className="absolute min-h-[calc(100vh-6rem)] bottom-0 w-screen bg-white grid place-items-center">
                <div>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default ModalWrapper