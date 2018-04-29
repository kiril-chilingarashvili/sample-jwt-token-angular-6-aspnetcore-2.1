using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Org.BouncyCastle.Crypto;
using Org.BouncyCastle.Crypto.Parameters;
using Org.BouncyCastle.OpenSsl;
using SystemX509 = System.Security.Cryptography.X509Certificates;

using Org.BouncyCastle.Asn1.Pkcs;
using Org.BouncyCastle.Asn1.X509;
using Org.BouncyCastle.Math;
using Org.BouncyCastle.X509;

namespace Refactorx.Host
{
    public class SigningKey
    {
        public SigningKey()
        {
/*
    Generate private key. Used some password.
    1. openssl genrsa -des3 -out private.pem 2048
    Get private key in PEM format
    2. openssl rsa -in private.pem -out private_unencrypted.pem -outform PEM
    Get public key also in PEM format
    3. openssl rsa -in private.pem -outform PEM -pubout -out public.pem
*/
            var key =
@"-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAuEE5VI9Pc1SEMELrdpsNIQExrlYKFUhHAjAs35qhUCg4Yj28
OZwayvbP9h0+aFuUd5NYiSyNwukE0O24YnCVjuj10XLkq+MNuZVx2dCnPJIM7hOn
AHJWTxsgPYKUaWXf99vDEb+zd+71NCaIEew2cAqfuo7NXpL4hAHUwBM0sLvR+d+p
GXDsA/2JXpSb1EO3l19UrNGB2EoBRPtDo+gc6KogKVXHGsAml1iafXhKx2j+IpZM
1BHqwWHAPV3bGnGOZx3ivKcvqS/NBIbjuowrn0t4z7K+zcZ8YjIil1fwiYvaOlM8
HZSe1cM0Q46nDBBZGLn36GKukYm1zfHXXmF7jQIDAQABAoH/GekSJtIAWjeIX0EJ
26PyNLH2So3O3S9MzQH5TXhxNtRxGV+VGITbP691jyaNoB9AwY/241NgnAgopTjI
tQ8f+PjJmKqPfZxwUaiyWe79lYb0SoZ49ZcejAFEh2HVfPzWggRlahmLI1J3KN5C
RELzZM4ZqCJsvt/sEqQvRtNslW2W/PAOmFwj1NL7d2J6+ORA3gSG+5OZBun1SJL0
lot42AXM5Uob3/PWYFBED0dWcG4qUPyuFSEoosBadm+7j4rBdmSj/DsMJ4jt7MB2
op4diA3jQPe/57KZLGryNCnSHFmdjAU8yLiSt3iiwPHoW3coNFgmdA8tViH6PL/l
LUGBAoGBAN/tQMQXRZD9NTJ23luI6hrOmZ//hfuxYLR1by2aXRUK7xE+tRv2A3D0
UMqomM7igZ0iHeLH+AvAQXbNMWgTUMEltvZe8VSqciXbwIQqgkJssMzn4ChW0yAN
Wz+BTxHeDby3OL6kxM55eP5QpHwc1XaaYmxYLmJuu+WmzkLUFZv1AoGBANKlUFob
piDHCaosNqFP0OWcLZEeVZ5N8IRLw0apippvi89/Umn5ok++Zs0tcf3mjb8/YxtU
kQtXGUDOHNaaghtyHxRXg9hBtfIc0dWzBJLN17DThFdeb8fqDuzjenkqRyx3eHfA
N/DNwJfnrJNzsB26xs0AfglSYOn3TU3z43o5AoGBAKCui4HqPRYMTAb5OxetyGcS
BzTDU65HGuCDQBMWKGL4JJJYT/dPciq0deDmWDhkWqOZnp5j5b7w50jLdv96lMD0
QjTJ7hxV7nDyHlP4eN4XRkrSvIvVucvPKcIJFOb6Uxsu0n4il8Kdcc/zqAQTYK2p
nKSoJiil0xi4uFtF+nedAoGARyX/VfAw1LFl2kzExwemj2eJHJMaaDX7HzRX6O4r
Gq7Cknt24sSmxjiRkIvhDNlq10YZu4l81E++/9yecP4PJCYPyVcl+U14nyaM2Zl1
2gAc8mT/NmN3bhboo6rSG0rkb2iLECekvXlBrA1chRF2UxRbQbMA3zUr9trJCaNv
GkECgYEAiXxeUUB6CovXPIwU1wa3hVgJfwPNwaeclnSBpi/70lJWHWGI/P27EHjD
Dwi+4SVT2L1oprKj5++Ov1+QGF33cD15hUbHhQ+fGlcXR/hbD9TW+Uc0hxueVyra
NjoEJUwqwC95c7sy1QrOLgUbVn/yZIFTLy/TRix4aT/OoZSpH1w=
-----END RSA PRIVATE KEY-----";

            using (var stream = new StringReader(key))
            {
                var reader = new PemReader(stream);
                var keyPair = (AsymmetricCipherKeyPair)reader.ReadObject();
                var rsaParams = DotNetUtilities.ToRSAParameters((RsaPrivateCrtKeyParameters)keyPair.Private);
                var rsa = new RSACryptoServiceProvider();
                rsa.ImportParameters(rsaParams);
                var bytes = rsa.ExportCspBlob(false);
                PublicKey = Convert.ToBase64String(bytes);
                Key = new RsaSecurityKey(rsa);
            }
        }

        public RsaSecurityKey Key { get; private set; }
        public string PublicKey { get; private set; }
    }
    public sealed class DotNetUtilities
    {
        private DotNetUtilities()
        {
        }

        /// <summary>
        /// Create an System.Security.Cryptography.X509Certificate from an X509Certificate Structure.
        /// </summary>
        /// <param name="x509Struct"></param>
        /// <returns>A System.Security.Cryptography.X509Certificate.</returns>
        public static SystemX509.X509Certificate ToX509Certificate(
            X509CertificateStructure x509Struct)
        {
            return new SystemX509.X509Certificate(x509Struct.GetDerEncoded());
        }

        public static SystemX509.X509Certificate ToX509Certificate(
            X509Certificate x509Cert)
        {
            return new SystemX509.X509Certificate(x509Cert.GetEncoded());
        }

        public static X509Certificate FromX509Certificate(
            SystemX509.X509Certificate x509Cert)
        {
            return new X509CertificateParser().ReadCertificate(x509Cert.GetRawCertData());
        }

        public static AsymmetricCipherKeyPair GetDsaKeyPair(DSA dsa)
        {
            return GetDsaKeyPair(dsa.ExportParameters(true));
        }

        public static AsymmetricCipherKeyPair GetDsaKeyPair(DSAParameters dp)
        {
            DsaValidationParameters validationParameters = (dp.Seed != null)
                ? new DsaValidationParameters(dp.Seed, dp.Counter)
                : null;

            DsaParameters parameters = new DsaParameters(
                new BigInteger(1, dp.P),
                new BigInteger(1, dp.Q),
                new BigInteger(1, dp.G),
                validationParameters);

            DsaPublicKeyParameters pubKey = new DsaPublicKeyParameters(
                new BigInteger(1, dp.Y),
                parameters);

            DsaPrivateKeyParameters privKey = new DsaPrivateKeyParameters(
                new BigInteger(1, dp.X),
                parameters);

            return new AsymmetricCipherKeyPair(pubKey, privKey);
        }

        public static DsaPublicKeyParameters GetDsaPublicKey(DSA dsa)
        {
            return GetDsaPublicKey(dsa.ExportParameters(false));
        }

        public static DsaPublicKeyParameters GetDsaPublicKey(DSAParameters dp)
        {
            DsaValidationParameters validationParameters = (dp.Seed != null)
                ? new DsaValidationParameters(dp.Seed, dp.Counter)
                : null;

            DsaParameters parameters = new DsaParameters(
                new BigInteger(1, dp.P),
                new BigInteger(1, dp.Q),
                new BigInteger(1, dp.G),
                validationParameters);

            return new DsaPublicKeyParameters(
                new BigInteger(1, dp.Y),
                parameters);
        }

        public static AsymmetricCipherKeyPair GetRsaKeyPair(RSA rsa)
        {
            return GetRsaKeyPair(rsa.ExportParameters(true));
        }

        public static AsymmetricCipherKeyPair GetRsaKeyPair(RSAParameters rp)
        {
            BigInteger modulus = new BigInteger(1, rp.Modulus);
            BigInteger pubExp = new BigInteger(1, rp.Exponent);

            RsaKeyParameters pubKey = new RsaKeyParameters(
                false,
                modulus,
                pubExp);

            RsaPrivateCrtKeyParameters privKey = new RsaPrivateCrtKeyParameters(
                modulus,
                pubExp,
                new BigInteger(1, rp.D),
                new BigInteger(1, rp.P),
                new BigInteger(1, rp.Q),
                new BigInteger(1, rp.DP),
                new BigInteger(1, rp.DQ),
                new BigInteger(1, rp.InverseQ));

            return new AsymmetricCipherKeyPair(pubKey, privKey);
        }

        public static RsaKeyParameters GetRsaPublicKey(RSA rsa)
        {
            return GetRsaPublicKey(rsa.ExportParameters(false));
        }

        public static RsaKeyParameters GetRsaPublicKey(
            RSAParameters rp)
        {
            return new RsaKeyParameters(
                false,
                new BigInteger(1, rp.Modulus),
                new BigInteger(1, rp.Exponent));
        }

        public static AsymmetricCipherKeyPair GetKeyPair(AsymmetricAlgorithm privateKey)
        {
            if (privateKey is DSA)
            {
                return GetDsaKeyPair((DSA)privateKey);
            }

            if (privateKey is RSA)
            {
                return GetRsaKeyPair((RSA)privateKey);
            }

            throw new ArgumentException("Unsupported algorithm specified", "privateKey");
        }

        public static RSA ToRSA(RsaKeyParameters rsaKey)
        {
            // TODO This appears to not work for private keys (when no CRT info)
            return CreateRSAProvider(ToRSAParameters(rsaKey));
        }

        public static RSA ToRSA(RsaKeyParameters rsaKey, CspParameters csp)
        {
            // TODO This appears to not work for private keys (when no CRT info)
            return CreateRSAProvider(ToRSAParameters(rsaKey), csp);
        }

        public static RSA ToRSA(RsaPrivateCrtKeyParameters privKey)
        {
            return CreateRSAProvider(ToRSAParameters(privKey));
        }

        public static RSA ToRSA(RsaPrivateCrtKeyParameters privKey, CspParameters csp)
        {
            return CreateRSAProvider(ToRSAParameters(privKey), csp);
        }

        public static RSA ToRSA(RsaPrivateKeyStructure privKey)
        {
            return CreateRSAProvider(ToRSAParameters(privKey));
        }

        public static RSA ToRSA(RsaPrivateKeyStructure privKey, CspParameters csp)
        {
            return CreateRSAProvider(ToRSAParameters(privKey), csp);
        }

        public static RSAParameters ToRSAParameters(RsaKeyParameters rsaKey)
        {
            RSAParameters rp = new RSAParameters();
            rp.Modulus = rsaKey.Modulus.ToByteArrayUnsigned();
            if (rsaKey.IsPrivate)
                rp.D = ConvertRSAParametersField(rsaKey.Exponent, rp.Modulus.Length);
            else
                rp.Exponent = rsaKey.Exponent.ToByteArrayUnsigned();
            return rp;
        }

        public static RSAParameters ToRSAParameters(RsaPrivateCrtKeyParameters privKey)
        {
            RSAParameters rp = new RSAParameters();
            rp.Modulus = privKey.Modulus.ToByteArrayUnsigned();
            rp.Exponent = privKey.PublicExponent.ToByteArrayUnsigned();
            rp.P = privKey.P.ToByteArrayUnsigned();
            rp.Q = privKey.Q.ToByteArrayUnsigned();
            rp.D = ConvertRSAParametersField(privKey.Exponent, rp.Modulus.Length);
            rp.DP = ConvertRSAParametersField(privKey.DP, rp.P.Length);
            rp.DQ = ConvertRSAParametersField(privKey.DQ, rp.Q.Length);
            rp.InverseQ = ConvertRSAParametersField(privKey.QInv, rp.Q.Length);
            return rp;
        }

        public static RSAParameters ToRSAParameters(RsaPrivateKeyStructure privKey)
        {
            RSAParameters rp = new RSAParameters();
            rp.Modulus = privKey.Modulus.ToByteArrayUnsigned();
            rp.Exponent = privKey.PublicExponent.ToByteArrayUnsigned();
            rp.P = privKey.Prime1.ToByteArrayUnsigned();
            rp.Q = privKey.Prime2.ToByteArrayUnsigned();
            rp.D = ConvertRSAParametersField(privKey.PrivateExponent, rp.Modulus.Length);
            rp.DP = ConvertRSAParametersField(privKey.Exponent1, rp.P.Length);
            rp.DQ = ConvertRSAParametersField(privKey.Exponent2, rp.Q.Length);
            rp.InverseQ = ConvertRSAParametersField(privKey.Coefficient, rp.Q.Length);
            return rp;
        }

        // TODO Move functionality to more general class
        private static byte[] ConvertRSAParametersField(BigInteger n, int size)
        {
            byte[] bs = n.ToByteArrayUnsigned();

            if (bs.Length == size)
                return bs;

            if (bs.Length > size)
                throw new ArgumentException("Specified size too small", "size");

            byte[] padded = new byte[size];
            Array.Copy(bs, 0, padded, size - bs.Length, bs.Length);
            return padded;
        }

        private static RSA CreateRSAProvider(RSAParameters rp)
        {
            CspParameters csp = new CspParameters();
            csp.KeyContainerName = string.Format("BouncyCastle-{0}", Guid.NewGuid());
            RSACryptoServiceProvider rsaCsp = new RSACryptoServiceProvider(csp);
            rsaCsp.ImportParameters(rp);
            return rsaCsp;
        }

        private static RSA CreateRSAProvider(RSAParameters rp, CspParameters csp)
        {
            RSACryptoServiceProvider rsaCsp = new RSACryptoServiceProvider(csp);
            rsaCsp.ImportParameters(rp);
            return rsaCsp;
        }
    }
}
