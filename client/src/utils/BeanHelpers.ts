export function getRoastLevelString(roastLevel: number) {
	if (roastLevel > 85) return "Espresso"
	if (roastLevel > 70) return "Dark"
	if (roastLevel > 25) return "Medium"
	if (roastLevel > 10) return "Light"
	return "Ultra Light"
}
