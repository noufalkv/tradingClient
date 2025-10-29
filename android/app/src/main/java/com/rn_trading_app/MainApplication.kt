package com.rn_trading_app

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader
import java.lang.reflect.Field

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // add(MyReactNativePackage())
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    
    // Initialize SoLoader for native dependencies with fallback for missing libraries
    try {
      SoLoader.init(this, false)
    } catch (e: UnsatisfiedLinkError) {
      // If feature flags JNI library is missing, continue anyway
      if (e.message?.contains("libreact_featureflagsjni") == true) {
        android.util.Log.w("MainApplication", "Feature flags JNI not available, continuing without it")
        // Don't rethrow - app can continue without feature flags
      } else {
        throw e
      }
    } catch (e: Exception) {
      e.printStackTrace()
      throw e
    }
    
    // Initialize Flipper for debugging (commented out due to dependency issues)
    // initializeFlipper(this, "com.rn_trading_app")
    
    loadReactNative(this)
  }

  /**
   * Loads Flipper in React Native applications. This is a no-op in release builds.
   */
  private fun initializeFlipper(app: Application, packageName: String) {
    try {
      /*
       We use reflection here to pick up Flipper, since it's not available in production
       releases of React Native apps.
      */
      val aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper")
      aClass
          .getMethod("initializeFlipper", Application::class.java, String::class.java)
          .invoke(null, app, packageName)
    } catch (e: Exception) {
      e.printStackTrace()
    }
  }
}
