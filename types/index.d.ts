type RootStackParamList = {
  HomeScreen: undefined;
};

interface ScreenHeaderProps {
  title: string;
  styleProps?: any;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.gif' {
  const value: any;
  export default value;
}
