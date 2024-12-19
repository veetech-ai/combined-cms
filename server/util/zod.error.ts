import { ZodError } from 'zod';

export const formatZodError = (error: ZodError): string => {
	// Group errors by category (db, ssl, jwt)
	const errorGroups = error.errors.reduce((groups, error) => {
		const category = error.path[0];
		if (!groups[category]) {
			groups[category] = [];
		}
		groups[category].push({
			field: error.path.join('.'),
			message: error.message,
		});
		return groups;
	}, {} as Record<string, Array<{ field: string; message: string }>>);

	// Format the error message
	let message = 'Configuration Error:\n\n';

	Object.entries(errorGroups).forEach(([category, errors]) => {
		message += `${category.toUpperCase()} Configuration:\n`;
		errors.forEach(error => {
			message += `  - ${error.field}: ${error.message}\n`;
		});
		message += '\n';
	});

	message +=
		'\nPlease check your environment variables and ensure all required values are set.';

	return message;
};
