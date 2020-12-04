---
title: Removing Usernames from Password Reset URLs in WooCommerce
ogImage: ""
---

Securely handling personal information on the web is a pretty big deal, and one of the ways you do that is making sure none of it's sent via query string in a URL. Things like this are bad:

`https://your-site.com?email=booger%40email.com`

In fact, Google has some clear policies explicitly prohibiting certain information from being passed through a URL, including things like ["email addresses, user logins, social security numbers, phone numbers or any piece of data that is deemed to be "PII"](https://developers.google.com/analytics/solutions/crm-integration#user_id). And if you do send any of this information to Google, [you'll be penalized](https://support.google.com/adwords/answer/6389382?hl=en) until the issue is resolved.

### A Vulnerability in WooCommerce

Out of the box, the WordPress e-commerce plugin [WooCommerce](https://woocommerce.com/) has a weak spot in this area. Password reset emails contain a link for a user to click to reset his/her password. That link, however, contains information that could be passed to a third party (like Google Analytics), posing a threat to users' privacy, and penalizing you for enabling it.

That vulnerable information is a username. Or, as WordPress often handles it, a user login. I'll be using "username" here because I like it more. For example: `http://my-site.com/settings/account/lost-password/?key=NaEYetJTi6fI2HKaNfxT&login=bartjansen`

To better protect private information like this, the solution is relatively straightforward: **Instead of passing a username, use an ID**. An ID will be unique to the WordPress instance, and make it much more difficult to use to identify an individual. And from what I've read, [Google endorses this type of approach](https://support.google.com/adwords/answer/6389382?hl=en).

### How Do I Fix This?

Long term, WooCommerce should change how it handles password reset emails, and I've already submitted a pull request to make that happen. But in the meantime, it's relatively easy to fix it on your own site right with a few bits of code. Let's dig into your theme...

#### Change How a Password Reset Link is Constructed

In each of the password reset email templates included within WooCommerce, we'll want to use the available `$user_login` variable to get the user's ID, and use that to construct a link that does **not** include a username.

To do this, you'll want to copy each of these templates into a `woocommerce` directory inside your active theme. Keep the file structure in tact as you do. For example, `woocommerce/templates/emails/plain/customer-reset-password.php` will be placed in `your-theme-woocommerce/emails/plain/customer-reset-password.php`. Then, start editing.

**woocommerce/templates/emails/plain/customer-reset-password.php**

```php
<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

// Getting the user ID here!
$user_id = get_user_by('login', $user_login)->ID;

echo "= " . $email_heading . " =\n\n";

echo __( 'Someone requested that the password be reset for the following account:', 'woocommerce' ) . "\r\n\r\n";
echo esc_url( network_home_url( '/' ) ) . "\r\n\r\n";
echo sprintf( __( 'Username: %s', 'woocommerce' ), $user_login ) . "\r\n\r\n";
echo __( 'If this was a mistake, just ignore this email and nothing will happen.', 'woocommerce' ) . "\r\n\r\n";
echo __( 'To reset your password, visit the following address:', 'woocommerce' ) . "\r\n\r\n";

// Passing the user ID here!
echo esc_url( add_query_arg( array( 'key' => $reset_key, 'id' => $user_id ), wc_get_endpoint_url( 'lost-password', '', wc_get_page_permalink( 'myaccount' ) ) ) ) . "\r\n";

echo "\n=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n\n";

echo apply_filters( 'woocommerce_email_footer_text', get_option( 'woocommerce_email_footer_text' ) );

```

**woocommerce/templates/emails/customer-reset-password.php**

```php
<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

// Getting the user ID here!
$user_id = get_user_by('login', $user_login)->ID;

?>

<?php do_action( 'woocommerce_email_header', $email_heading, $email ); ?>

<p><?php _e( 'Someone requested that the password be reset for the following account:', 'woocommerce' ); ?></p>
<p><?php printf( __( 'Username: %s', 'woocommerce' ), $user_login ); ?></p>
<p><?php _e( 'If this was a mistake, just ignore this email and nothing will happen.', 'woocommerce' ); ?></p>
<p><?php _e( 'To reset your password, visit the following address:', 'woocommerce' ); ?></p>
<p>
    <a class="link" href="<?php echo esc_url( add_query_arg( array( 'key' => $reset_key, 'id' => $user_id ), wc_get_endpoint_url( 'lost-password', '', wc_get_page_permalink( 'myaccount' ) ) ) ); ?>">
            <?php _e( 'Click here to reset your password', 'woocommerce' ); ?></a>
</p>
<p></p>

<?php do_action( 'woocommerce_email_footer', $email ); ?>

```

#### Process a User ID URL Variable Instead of Username

Next, we need to remove the action that requires a user login be passed in the URL, and replace it with one that accepts an `id`. We can then use that value to get the username, which will still be used when the user clicks the generated link. Do this inside your theme's `functions.php` file.

**functions.php**

```php
remove_action('template_redirect', 'WC_Form_Handler::redirect_reset_password_link');

add_action('template_redirect', function () {
    if ( is_account_page() && ! empty( $_GET['key'] ) && ! empty( $_GET['id'] ) ) {

        //-- Get the username by user ID.
        $user_login = get_user_by('id', $_GET['id'])->user_login;

        $value = sprintf( '%s:%s', wp_unslash( $user_login ), wp_unslash( $_GET['key'] ) );
        WC_Shortcode_My_Account::set_reset_password_cookie( $value );
        wp_safe_redirect( add_query_arg( 'show-reset-form', 'true', wc_lostpassword_url() ) );
        exit;
    }
});
```

Finished. Now, when users request to reset their passwords, the links they're sent via email will contain no reference to a username. Instead, it'll be something like this: `http://my-site.com/settings/account/lost-password/?key=NaEYetJTi6fI2HKaNfxT&id=23423`

Your customers are safer, and you'll have less to worry about.
