import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginSchema, type LoginSchemaType } from "../schema/RegisterSchema";

export const Login = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<LoginSchemaType>({
		resolver: zodResolver(LoginSchema),
	});

	const onSubmit = (data: LoginSchemaType) => {
		console.log(data);
		reset();
	};

	return (
		<div className="bg-white flex flex-col items-center justify-center p-8 rounded-lg shadow-md h-fit w-1/5">
			<h1 className="text-2xl font-bold mb-4">Login</h1>
			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
				<input
					type="email"
					name="email"
					placeholder="Email"
					{...register("email")}
					className="w-full px-4 py-2 rounded-md border border-gray-400"
				/>
				{errors.email && <p>{errors.email.message}</p>}
				<input
					type="password"
					name="password"
					placeholder="Password"
					{...register("password")}
					className="w-full px-4 py-2 rounded-md border-2 border-gray-400"
				/>
				{errors.password && <p>{errors.password.message}</p>}
				<button
					className="bg-blue-500 text-white p-2 rounded-md hover:cursor-pointer"
					type="submit"
					disabled={isSubmitting}
				>
					{isSubmitting ? "Logging In..." : "Login"}
				</button>
			</form>
		</div>
	);
};
