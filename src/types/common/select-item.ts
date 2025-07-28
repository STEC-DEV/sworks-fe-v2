export interface SelectOption {
  key: string;
  value: number | string;
}

export const convertSelectOptionType = (arrayItems: Array<any>) => {
  const selectOptions: SelectOption[] = [];

  arrayItems.forEach((arr) => {
    const keys = Object.keys(arr);
    selectOptions.push({ key: arr[keys[1]], value: parseInt(arr[keys[0]]) });
  });

  return selectOptions;
};
