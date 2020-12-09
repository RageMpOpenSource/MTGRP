using GTANetworkAPI;

namespace mtgvrp.attachment_manager
{
    /// <summary>
    /// Thanks to DasNiels for providing Efficient Attachment Sync C#
    /// </summary>
    public class AttachmentService : Script
    {
        /// <summary>
        /// Resets attachment data on when connected
        /// </summary>
        /// <param name="player"></param>
        [ServerEvent(Event.PlayerConnected)]
        public void OnPlayerConnect(Player player)
        {
            player.ClearAttachments();
        }
        /// <summary>
        /// This method is required to process the attachment received client-side
        /// </summary>
        /// <param name="player"></param>
        /// <param name="attachment"></param>
        [RemoteEvent("staticAttachments.Add")]
        private void OnStaticAttachmentAdd(Player player, string attachment)
        {
            player.ToggleAttachment(attachment, false);
        }

        /// <summary>
        /// This method is required to remove the attachment received client-side
        /// </summary>
        /// <param name="player"></param>
        /// <param name="attachment"></param>
        [RemoteEvent("staticAttachments.Remove")]
        private void OnStaticAttachmentRemove(Player player, string attachment)
        {
            player.ToggleAttachment(attachment, true);
        }
    }
}
