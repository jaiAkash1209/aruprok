package com.avenix.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.weight
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.avenix.app.ui.theme.AvenixTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AvenixRoot()
        }
    }
}

enum class Role(val label: String) {
    Admin("Admin"),
    User("User"),
    Shopkeeper("Shopkeeper")
}

data class UserAccount(
    val name: String,
    val email: String,
    val phone: String,
    val role: String
)

data class ShopAccount(
    val shopName: String,
    val shopType: String,
    val email: String,
    val owner: String
)

data class VerificationRecord(
    val shopName: String,
    val shopPhoto: String,
    val aadharPhoto: String,
    val status: String
)

@Composable
fun AvenixRoot() {
    var darkMode by rememberSaveable { mutableStateOf(false) }
    val users = remember {
        mutableStateListOf(
            UserAccount("Aarav Kumar", "aarav@market.com", "9876543210", "User"),
            UserAccount("Meera Das", "meera@market.com", "9898989898", "User")
        )
    }
    val shops = remember {
        mutableStateListOf(
            ShopAccount("FixFast Mechanic Hub", "Mechanic", "fixfast@shops.com", "Rohan Singh"),
            ShopAccount("Rina Spice Corner", "Grocery", "rina@shops.com", "Rina Paul")
        )
    }
    val verifications = remember {
        mutableStateListOf(
            VerificationRecord("FixFast Mechanic Hub", "fixfast_shop.jpg", "rohan_aadhar.jpg", "Approved"),
            VerificationRecord("Rina Spice Corner", "rina_shop.jpg", "rina_aadhar.jpg", "Approved")
        )
    }

    AvenixTheme(darkTheme = darkMode) {
        Surface(modifier = Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
            val navController = rememberNavController()
            NavHost(navController = navController, startDestination = "home") {
                composable("home") {
                    HomeScreen(
                        navController = navController,
                        darkMode = darkMode,
                        onToggleTheme = { darkMode = !darkMode },
                        userCount = users.size,
                        shopCount = shops.size,
                        verificationCount = verifications.size
                    )
                }
                composable("login") {
                    LoginScreen(navController = navController)
                }
                composable("signup_user") {
                    UserSignupScreen(
                        navController = navController,
                        onCreateUser = { users.add(it) }
                    )
                }
                composable("signup_shop") {
                    ShopSignupScreen(
                        navController = navController,
                        onCreateShop = { shop, verification ->
                            shops.add(shop)
                            verifications.add(verification)
                        }
                    )
                }
                composable("admin") {
                    AdminDashboardScreen(users = users, shops = shops, verifications = verifications)
                }
                composable("user_dashboard") {
                    SimpleDashboardScreen(
                        title = "User Dashboard",
                        subtitle = "Browse local shops, place orders, and track nearby services."
                    )
                }
                composable("shop_dashboard") {
                    SimpleDashboardScreen(
                        title = "Shopkeeper Dashboard",
                        subtitle = "Manage profile, products, and verification status."
                    )
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    navController: NavHostController,
    darkMode: Boolean,
    onToggleTheme: () -> Unit,
    userCount: Int,
    shopCount: Int,
    verificationCount: Int
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Avenix") },
                actions = {
                    TextButton(onClick = onToggleTheme) {
                        Text(if (darkMode) "\u2600" else "\u263E")
                    }
                }
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                HeroCard(
                    title = "Digitalize local shops with one Android app",
                    subtitle = "Home dashboard, login, user signup, shopkeeper verification, and admin record tables."
                )
            }
            item {
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
                    StatChip("Users", userCount.toString(), Modifier.weight(1f))
                    StatChip("Shops", shopCount.toString(), Modifier.weight(1f))
                    StatChip("Checks", verificationCount.toString(), Modifier.weight(1f))
                }
            }
            item {
                SectionCard("About Us", "Avenix connects users, mechanics, and shopkeepers in one verified local ecosystem.")
            }
            item {
                SectionCard("Contact", "Support: support@avenix.com\nPhone: +91 90000 12345\nOffice: Chennai")
            }
            item {
                SectionCard("Services", "User accounts, shopkeeper onboarding, Aadhaar verification, and admin record stacks.")
            }
            item {
                ButtonRow(
                    onLogin = { navController.navigate("login") },
                    onUserSignup = { navController.navigate("signup_user") },
                    onShopSignup = { navController.navigate("signup_shop") }
                )
            }
        }
    }
}

@Composable
fun HeroCard(title: String, subtitle: String) {
    Card(
        shape = RoundedCornerShape(28.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        modifier = Modifier.fillMaxWidth()
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    Brush.linearGradient(
                        listOf(
                            MaterialTheme.colorScheme.primary.copy(alpha = 0.22f),
                            MaterialTheme.colorScheme.tertiary.copy(alpha = 0.12f)
                        )
                    )
                )
                .padding(20.dp)
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(title, style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
                Text(subtitle, style = MaterialTheme.typography.bodyLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
    }
}

@Composable
fun StatChip(label: String, value: String, modifier: Modifier = Modifier) {
    Card(modifier = modifier, shape = RoundedCornerShape(20.dp)) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text(value, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
            Text(label, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
fun SectionCard(title: String, body: String) {
    Card(shape = RoundedCornerShape(24.dp), modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(title, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.SemiBold)
            Text(body, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
fun ButtonRow(onLogin: () -> Unit, onUserSignup: () -> Unit, onShopSignup: () -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        Button(onClick = onLogin, modifier = Modifier.fillMaxWidth()) { Text("Login") }
        OutlinedButton(onClick = onUserSignup, modifier = Modifier.fillMaxWidth()) { Text("Create User Account") }
        OutlinedButton(onClick = onShopSignup, modifier = Modifier.fillMaxWidth()) { Text("Create Shopkeeper Account") }
    }
}

@Composable
fun LoginScreen(navController: NavHostController) {
    var email by rememberSaveable { mutableStateOf("") }
    var password by rememberSaveable { mutableStateOf("") }
    var selectedRole by rememberSaveable { mutableStateOf(Role.Admin) }

    FormScreen(title = "Login") {
        RoleSelector(selectedRole = selectedRole, onRoleSelected = { selectedRole = it })
        AppField("Email", email) { email = it }
        AppField("Password", password) { password = it }
        Button(
            onClick = {
                val route = when (selectedRole) {
                    Role.Admin -> "admin"
                    Role.User -> "user_dashboard"
                    Role.Shopkeeper -> "shop_dashboard"
                }
                navController.navigate(route)
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Continue")
        }
    }
}

@Composable
fun UserSignupScreen(navController: NavHostController, onCreateUser: (UserAccount) -> Unit) {
    var name by rememberSaveable { mutableStateOf("") }
    var email by rememberSaveable { mutableStateOf("") }
    var phone by rememberSaveable { mutableStateOf("") }
    var password by rememberSaveable { mutableStateOf("") }

    FormScreen(title = "Create User Account") {
        AppField("Full Name", name) { name = it }
        AppField("Email", email) { email = it }
        AppField("Phone", phone, keyboardType = KeyboardType.Phone) { phone = it }
        AppField("Password", password) { password = it }
        Button(
            onClick = {
                onCreateUser(UserAccount(name, email, phone, "User"))
                navController.navigate("admin")
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Save User")
        }
    }
}

@Composable
fun ShopSignupScreen(
    navController: NavHostController,
    onCreateShop: (ShopAccount, VerificationRecord) -> Unit
) {
    var shopName by rememberSaveable { mutableStateOf("") }
    var owner by rememberSaveable { mutableStateOf("") }
    var type by rememberSaveable { mutableStateOf("") }
    var email by rememberSaveable { mutableStateOf("") }
    var shopPhoto by rememberSaveable { mutableStateOf("") }
    var aadharPhoto by rememberSaveable { mutableStateOf("") }

    FormScreen(title = "Create Shopkeeper Account") {
        AppField("Shop Name", shopName) { shopName = it }
        AppField("Owner Name", owner) { owner = it }
        AppField("Shop Type", type) { type = it }
        AppField("Email", email) { email = it }
        AppField("Shop Photo Name", shopPhoto) { shopPhoto = it }
        AppField("Aadhaar Photo Name", aadharPhoto) { aadharPhoto = it }
        Text(
            "In Android Studio, these text fields can later be replaced with real image pickers for shop and Aadhaar uploads.",
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Button(
            onClick = {
                onCreateShop(
                    ShopAccount(shopName, type, email, owner),
                    VerificationRecord(shopName, shopPhoto, aadharPhoto, "Pending Review")
                )
                navController.navigate("admin")
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Save Shopkeeper")
        }
    }
}

@Composable
fun AdminDashboardScreen(
    users: List<UserAccount>,
    shops: List<ShopAccount>,
    verifications: List<VerificationRecord>
) {
    Scaffold(topBar = { TopAppBar(title = { Text("Admin Dashboard") }) }) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item { RecordsCard(title = "User Accounts", headers = listOf("Name", "Email", "Role", "Phone"), rows = users.map { listOf(it.name, it.email, it.role, it.phone) }) }
            item { RecordsCard(title = "Mechanic and Shopkeeper Accounts", headers = listOf("Shop", "Type", "Email", "Owner"), rows = shops.map { listOf(it.shopName, it.shopType, it.email, it.owner) }) }
            item { RecordsCard(title = "Verification Stack", headers = listOf("Shop", "Shop Photo", "Aadhaar", "Status"), rows = verifications.map { listOf(it.shopName, it.shopPhoto, it.aadharPhoto, it.status) }) }
        }
    }
}

@Composable
fun RecordsCard(title: String, headers: List<String>, rows: List<List<String>>) {
    Card(shape = RoundedCornerShape(24.dp), modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            Text(title, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.SemiBold)
            headers.forEachIndexed { index, header ->
                if (index == 0) {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        headers.forEach { Text(it, modifier = Modifier.weight(1f), fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary) }
                    }
                    Divider()
                }
            }
            rows.forEach { row ->
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    row.forEach { cell ->
                        Text(cell, modifier = Modifier.weight(1f), color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
                Divider()
            }
        }
    }
}

@Composable
fun SimpleDashboardScreen(title: String, subtitle: String) {
    Scaffold(topBar = { TopAppBar(title = { Text(title) }) }) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            SectionCard(title = title, body = subtitle)
        }
    }
}

@Composable
fun FormScreen(title: String, content: @Composable ColumnScope.() -> Unit) {
    Scaffold(topBar = { TopAppBar(title = { Text(title) }) }) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp),
            content = content
        )
    }
}

@Composable
fun RoleSelector(selectedRole: Role, onRoleSelected: (Role) -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        Text("Choose Role", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
            Role.entries.forEach { role ->
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(18.dp))
                        .background(if (role == selectedRole) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surfaceVariant)
                        .clickable { onRoleSelected(role) }
                        .padding(14.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(role.label)
                }
            }
        }
    }
}

@Composable
fun AppField(
    label: String,
    value: String,
    keyboardType: KeyboardType = KeyboardType.Text,
    onValueChange: (String) -> Unit
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = Modifier.fillMaxWidth(),
        label = { Text(label) },
        keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
        shape = RoundedCornerShape(18.dp)
    )
}
