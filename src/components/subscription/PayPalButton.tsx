'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

declare global {
    interface Window {
        paypal: any;
    }
}

interface PayPalButtonProps {
    planId: string;
    onSuccess?: (subscriptionId: string) => void;
}

export function PayPalButton({ planId, onSuccess }: PayPalButtonProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonId = `paypal-button-container-${planId}`;

    const renderPayPalButton = () => {
        if (window.paypal && containerRef.current) {
            // Check if already rendered to avoid duplicates
            if (containerRef.current.innerHTML === '') {
                window.paypal.Buttons({
                    style: {
                        shape: 'rect',
                        color: 'gold',
                        layout: 'vertical',
                        label: 'subscribe'
                    },
                    createSubscription: function (data: any, actions: any) {
                        return actions.subscription.create({
                            plan_id: planId
                        });
                    },
                    onApprove: function (data: any, actions: any) {
                        alert('Assinatura realizada com sucesso! ID: ' + data.subscriptionID);
                        if (onSuccess) onSuccess(data.subscriptionID);
                    },
                    onError: function (err: any) {
                        console.error('PayPal Error:', err);
                        alert('Erro no PayPal: ' + err.message);
                    }
                }).render(`#${buttonId}`);
            }
        }
    };

    return (
        <div className="w-full">
            <Script
                src="https://www.paypal.com/sdk/js?client-id=AcBKbeZA_i9TB8W7gJetk9BmbK_W_gmZHD3iDerIb72ZVJIDIBwKIT9WOfjBbicjp7EZrtK4mDA9aNoC&vault=true&intent=subscription"
                onLoad={renderPayPalButton}
                strategy="lazyOnload"
            />
            <div id={buttonId} ref={containerRef} className="w-full"></div>
        </div>
    );
}
