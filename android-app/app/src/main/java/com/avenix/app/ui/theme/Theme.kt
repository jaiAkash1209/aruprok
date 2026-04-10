package com.avenix.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColors = lightColorScheme(
    primary = Color(0xFFCC633B),
    secondary = Color(0xFF5D8B6F),
    tertiary = Color(0xFFF0B86C),
    background = Color(0xFFF6EFE6),
    surface = Color(0xFFFFFAF4)
)

private val DarkColors = darkColorScheme(
    primary = Color(0xFFF0A058),
    secondary = Color(0xFF7AC7A1),
    tertiary = Color(0xFFFFD08C),
    background = Color(0xFF10161D),
    surface = Color(0xFF17202A)
)

@Composable
fun AvenixTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = if (darkTheme) DarkColors else LightColors,
        content = content
    )
}
