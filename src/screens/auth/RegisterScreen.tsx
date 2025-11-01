import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView';
import CenteredLogo from '../../components/global/CenteredLogo';
import { goBack } from '../../utils/NavigationUtil';
import CustomInput from '../../components/inputs/CustomInput';
import { useAppDispatch } from '../../redux/reduxHook';
import { validatePasswordLength } from '../../utils/ValidationUtils';
import { RFValue } from 'react-native-responsive-fontsize';
import { GlobalStyles } from '../../styles/GlobalStyles';
import CustomButton from '../../components/global/CustomButton';
import { RegisterUser } from '../../redux/actions/userAction';

const RegisterScreen = ({ route }: any) => {
  const [password, setPassword] = useState('SecurePass123!');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const validate = () => {
    if (!validatePasswordLength(password)) {
      setPasswordError('Please enter a valid password');
      return false;
    }
    return true;
  };

  const handleOnSubmit = async () => {
    setLoading(true);

    if (validate()) {
      await dispatch(
        RegisterUser({
          email: route.params.email,
          password: password,
          register_token: route.params.register_token,
        }),
      );
    }
    setLoading(false);
  };

  return (
    <CustomSafeAreaView>
      <ScrollView>
        <CenteredLogo />

        <TouchableOpacity onPress={() => goBack()}>
          <View pointerEvents="none">
            <CustomInput label="EMAIL ADDRESS" value={route.params.email} />
          </View>
        </TouchableOpacity>

        <CustomInput
          label="ENTER PASSWORD"
          returnKeyType="done"
          placeholder="8-20 Characters"
          value={password}
          autoFocus={true}
          error={passwordError}
          onChangeText={text => {
            setPassword(text);
            setPasswordError('');
          }}
          onSubmitEditing={handleOnSubmit}
          password
        />

        {/* <TouchableText
          onPress={() =>
            navigate('ForgotPassword', {
              email: route.params.email,
            })
          }
          firstText="Forgot Password?"
          style={styles.forgotText}
        /> */}
      </ScrollView>

      <View style={GlobalStyles.bottomBtn}>
        <CustomButton
          text="ENTER"
          loading={loading}
          disabled={loading}
          onPress={() => {
            handleOnSubmit();
          }}
        />
      </View>
    </CustomSafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  forgotText: {
    fontSize: RFValue(10),
    marginTop: 5,
    alignSelf: 'flex-end',
  },
});
