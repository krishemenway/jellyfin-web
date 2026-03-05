import * as React from "react";
import { Layout } from "Common/Layout";
import { SelectFieldEditor } from "Common/SelectFieldEditor";
import { ThemeService } from "Themes/ThemeService";
import { FieldLabel } from "Common/FieldLabel";

export const ChangeTheme: React.FC = () => {
	return (
		<Layout direction="column" gap="1rem">
			<FieldLabel field={ThemeService.Instance.ThemeField} />
			<SelectFieldEditor
				field={ThemeService.Instance.ThemeField}
				allOptions={ThemeService.Instance.AllThemes}
				getLabel={(t) => t.Name}
				getValue={(t) => t.Name}
			/>
		</Layout>
	);
};
