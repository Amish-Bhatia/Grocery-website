import React, { useState } from "react";
// import apimethods from "../../Methods/ApiClient";
// import Swal from "sweetalert2";
// import Table from "../../Components/Table";

const AddEdit = ({ showForm, setShowForm }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
    });
    const columns = [
        {
            key: "name",
            label: "Name",
        },
        {
            key: "email",
            label: "Email",
        },
        {
            key: "role",
            label: "Role",
        },
    ];
    const [staffList, setStaffList] = useState([]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Data Submitted:", formData);

        // try {
        //     const response = await apimethods.postApi("/createStaff", {
        //         ...formData,
        //     });

        //     console.log("Staff added successfully:", response);
        //     const newStaff = response?.data || response;
        //     setStaffList((prev) => [...prev, newStaff]);
        //     localStorage.setItem(
        //         "response",
        //         JSON.stringify(response)
        //     );
        //     Swal.fire({
        //         title: "Staff Added Successfully",
        //         icon: "success",
        //         draggable: true,
        //     });
        //     setFormData({
        //         name: "",
        //         email: "",
        //         password: "",
        //         role: "",
        //     });
        //     setShowForm(false);
        // } catch (error) {
        //     console.log("Failed to add staff:", error);
        //     Swal.fire({
        //         title: "Failed to Add Staff",
        //         text:
        //             error.response.data.message ||
        //             "Something went wrong",
        //         icon: "error",
        //     });
        // }
    };
    return (
        <div className="min-h-screen">
            
            {showForm && (
                <div className="flex items-center justify-center">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-md rounded-2xl border border-green-100 bg-white p-8 shadow-lg"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-green-700">
                                Add Staff
                            </h2>

                            <button type="button" onClick={() => setShowForm(false)} className="text-xl text-gray-500 hover:text-red-500"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Name
                            </label>

                            <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter name" required className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"/>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email" required className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>

                            <input id="password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter password" required className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
                            />
                        </div>

                        <div className="mb-6">
                            <label
                                htmlFor="role"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Role
                            </label>

                            <select id="role" name="role" value={formData.role} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
                            >
                                <option value="">Select Role</option>
                                <option value="admin">Admin</option>
                                <option value="staff">Staff</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-green-600 py-2.5 font-semibold text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 active:bg-green-800"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};
export default AddEdit;
