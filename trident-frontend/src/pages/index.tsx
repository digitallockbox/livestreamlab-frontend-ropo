import { useState } from "react";
import { Button, Input, Modal, Table, useToast } from "../components/ui";
import { dashboardApi } from "../utils/dashboardApi";

type WalletActionRow = {
  action: string;
  status: string;
  details: string;
};

export default function HomePage(): JSX.Element {
  const { addToast } = useToast();
  const [publicKey, setPublicKey] = useState("9uEJcA3kPPhantomDevWallet");
  const [challenge, setChallenge] = useState<string | null>(null);
  const [signature, setSignature] = useState("");
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [activityRows, setActivityRows] = useState<WalletActionRow[]>([]);
  const [isBusy, setIsBusy] = useState(false);

  const addActivity = (row: WalletActionRow): void => {
    setActivityRows((previous) => [row, ...previous].slice(0, 6));
  };

  const handleConnect = async (): Promise<void> => {
    setIsBusy(true);
    try {
      const response = await dashboardApi.phantomConnect({ publicKey });
      setChallenge(response.challenge);
      setSignature(`signed:${response.challenge}`);
      setIsWalletModalOpen(true);
      addActivity({
        action: "Connect",
        status: "Success",
        details: `Challenge issued for ${response.walletAddress}`,
      });
      addToast({ message: "Phantom challenge issued", type: "success" });
    } catch {
      addActivity({
        action: "Connect",
        status: "Failed",
        details: "Could not initialize Phantom challenge",
      });
      addToast({ message: "Phantom connect failed", type: "error" });
    } finally {
      setIsBusy(false);
    }
  };

  const handleVerify = async (): Promise<void> => {
    if (!challenge) {
      return;
    }

    setIsBusy(true);
    try {
      const response = await dashboardApi.phantomVerify({
        publicKey,
        signature,
        challenge,
      });

      setSessionToken(response.sessionToken);
      addActivity({
        action: "Verify",
        status: response.verified ? "Success" : "Failed",
        details: `Wallet ${response.walletAddress} verified as ${response.roles.join(", ")}`,
      });
      addToast({ message: "Web3 login successful", type: "success" });
      setIsWalletModalOpen(false);
    } catch {
      addActivity({
        action: "Verify",
        status: "Failed",
        details: "Signature verification rejected",
      });
      addToast({ message: "Phantom verify failed", type: "error" });
    } finally {
      setIsBusy(false);
    }
  };

  const handleLinkWallet = async (): Promise<void> => {
    if (!sessionToken) {
      return;
    }

    setIsBusy(true);
    try {
      const response = await dashboardApi.phantomLink({
        sessionToken,
        role: "creator",
      });

      addActivity({
        action: "Link",
        status: response.linked ? "Success" : "Failed",
        details: `Linked as ${response.role} at ${new Date(
          response.linkedAt,
        ).toLocaleTimeString()}`,
      });
      addToast({
        message: "Wallet linked for creator payouts",
        type: "success",
      });
    } catch {
      addActivity({
        action: "Link",
        status: "Failed",
        details: "Could not link wallet role",
      });
      addToast({ message: "Phantom link failed", type: "error" });
    } finally {
      setIsBusy(false);
    }
  };

  const handleCheckout = async (): Promise<void> => {
    if (!sessionToken) {
      return;
    }

    setIsBusy(true);
    try {
      const response = await dashboardApi.phantomCheckout({
        sessionToken,
        orderId: "order-web3-001",
        amount: 49,
        currency: "USDC",
      });

      addActivity({
        action: "Checkout",
        status: response.accepted ? "Success" : "Failed",
        details: `Receipt ${response.receiptId} / ${response.transactionSignature}`,
      });
      addToast({ message: "Phantom checkout confirmed", type: "success" });
    } catch {
      addActivity({
        action: "Checkout",
        status: "Failed",
        details: "Checkout signature or receipt failed",
      });
      addToast({ message: "Phantom checkout failed", type: "error" });
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <main className="home-page">
      <section className="web3-wall">
        <p className="web3-kicker">Web3 Access Wall</p>
        <h1 className="home-title">livestreamlab.live</h1>
        <p className="home-subtitle">
          Sign with Phantom to unlock creator identity, payouts, and checkout.
        </p>

        <div className="web3-input-row">
          <Input
            ariaLabel="Phantom public key"
            value={publicKey}
            onChange={setPublicKey}
            placeholder="Enter Phantom wallet public key"
          />
          <Button
            variant="primary"
            onClick={() => void handleConnect()}
            disabled={isBusy}
          >
            Connect Phantom
          </Button>
        </div>

        <div className="web3-action-row">
          <Button
            variant="secondary"
            onClick={() => void handleLinkWallet()}
            disabled={isBusy || !sessionToken}
          >
            Link Wallet
          </Button>
          <Button
            variant="secondary"
            onClick={() => void handleCheckout()}
            disabled={isBusy || !sessionToken}
          >
            Test Checkout
          </Button>
          <a href="/dashboard" className="home-link">
            Continue to Dashboard
          </a>
        </div>

        <div className="surface-table-wrap">
          <Table
            columns={[
              { header: "Action", key: "action" },
              { header: "Status", key: "status" },
              { header: "Details", key: "details" },
            ]}
            rows={activityRows}
          />
        </div>
      </section>

      <Modal
        isOpen={isWalletModalOpen}
        title="Sign Phantom Challenge"
        onClose={() => setIsWalletModalOpen(false)}
      >
        <div className="web3-modal-grid">
          <p className="overlay-field-label">Challenge</p>
          <p className="overlay-token-value">{challenge ?? "-"}</p>
          <p className="overlay-field-label">Signature</p>
          <Input
            ariaLabel="Phantom signature"
            value={signature}
            onChange={setSignature}
            placeholder="signed:..."
          />
          <Button
            variant="primary"
            onClick={() => void handleVerify()}
            disabled={isBusy}
          >
            Verify Web3 Login
          </Button>
        </div>
      </Modal>
    </main>
  );
}
