import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { LogBox } from 'react-native';
import 'react-native-svg';
import { Provider } from 'react-redux';
import ArticlePage from './components/ArticleScreen';
import CameraScreen from './components/CameraScreen';
import ChatScreen from './components/ChatScreen';
import CommunityScreen from './components/CommunityScreen'; // Import VerifyScreen here
import HomeScreen from './components/HomeScreen'; // Your HomeScreen component
import LoginScreen from './components/LoginScreen';
import SettingsScreen from './components/SettingsScreen';
import SettingsScreen_Language from './components/SettingsScreen_Language';
import SettingsScreen_MyFamily from './components/SettingsScreen_MyFamily';
import SettingsScreen_PrivacyAndSecurity from './components/SettingsScreen_PrivacyAndSecurity';
import SignupScreen from './components/SignupScreen';
import UnderDevelopment from './components/UnderDevelopment';
import VerifyScreen from './components/VerifyScreen'; // Import VerifyScreen here
import store from './components/store'; // Import your Redux store
import './localization/i18n';

const Stack = createNativeStackNavigator();
const App = () => {
	LogBox.ignoreLogs(['Warning: ...']); // Ignore specific log messages
	LogBox.ignoreAllLogs(); // Ignore all log messages

	return (
		<Provider store={store}>
			<NavigationContainer>
				<Stack.Navigator
					screenOptions={{
						headerShown: false,
					}}
				>
					<Stack.Screen
						name='Home'
						component={HomeScreen}
						options={{ headerShown: false }} // Hides the default header as you are using a custom one
					/>
					<Stack.Screen name='Login' component={LoginScreen} />
					<Stack.Screen name='Signup' component={SignupScreen} />
					<Stack.Screen name='UnderDevelopment' component={UnderDevelopment} />
					<Stack.Screen name='Settings' component={SettingsScreen} />
					<Stack.Screen name='ChatBot' component={ChatScreen} />
					<Stack.Screen name='Verify' component={VerifyScreen} />
					<Stack.Screen name='Community' component={CommunityScreen} />
					<Stack.Screen name='Article' component={ArticlePage} />
					<Stack.Screen name='Privacy' component={SettingsScreen_PrivacyAndSecurity} />
					<Stack.Screen name='Language' component={SettingsScreen_Language} />
					<Stack.Screen name='Family' component={SettingsScreen_MyFamily} />
					<Stack.Screen name='Camera' component={CameraScreen} />
				</Stack.Navigator>
			</NavigationContainer>
		</Provider>
	);
};

export default App;
